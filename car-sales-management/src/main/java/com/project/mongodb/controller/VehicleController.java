package com.project.mongodb.controller;

import java.io.File;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

import javax.servlet.ServletContext;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.mongodb.constants.CommonConstants;
import com.project.mongodb.enums.PurchaseStatusEnum;
import com.project.mongodb.enums.UserRolesEnum;
import com.project.mongodb.enums.VehicleStatusEnum;
import com.project.mongodb.exception.ResourceNotFoundException;
import com.project.mongodb.user.admin.Admin;
import com.project.mongodb.user.admin.AdminRepository;
import com.project.mongodb.user.seller.Seller;
import com.project.mongodb.user.seller.SellerRepository;
import com.project.mongodb.vehicle.Vehicle;
import com.project.mongodb.vehicle.VehicleRepository;

@RestController
@RequestMapping("/api/vehicle")
@CrossOrigin(origins = "http://localhost:3000")
public class VehicleController {

	@Autowired
	private ServletContext servletContext;

	@Autowired
	private SellerRepository sellerRepository;

	@Autowired
	private VehicleRepository vehicleRepository;

	@Autowired
	private AdminRepository adminRepository;

	@PostMapping("addVehicle/{userId}")
	public ResponseEntity<String> addVehicle(@PathVariable String userId, @RequestParam("vehicle") String vehicleJson , @RequestParam(required = false,name = "image") MultipartFile image) {
		Seller sellerDetails = sellerRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
		try {
			UserRolesEnum role = getUserRole(sellerDetails.getRole());
			if(role == UserRolesEnum.SELLER) {
				ObjectMapper objectMapper = new ObjectMapper();
				Vehicle vehicle = objectMapper.readValue(vehicleJson, Vehicle.class);
				vehicle.setSellerId(sellerDetails.getId());
				if(image != null) {
					String imagePath = saveImage(image);
					vehicle.setImage(imagePath);
				}
				vehicle.setStatus(VehicleStatusEnum.INITIATED.getStatus());
				vehicle.setPurchaseStatus(PurchaseStatusEnum.AVAILABLE.getStatus());
				vehicle.setDateCreated(new Date());
				vehicleRepository.save(vehicle);
			} else {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(CommonConstants.USER_HAS_NO_RIGHTS_TO_ADD_VEHICLE);
			}
			
		} catch(Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(CommonConstants.INTERNAL_SERVER_ERROR);
		}
		return ResponseEntity.ok(CommonConstants.SUCCESSFULLY_UPLOADED_THE_CAR_DETAILS);
	}

	private String saveImage(MultipartFile image) throws IOException {
		String webappPath = servletContext.getRealPath("/") + "images/";
		File uploadDir = new File(webappPath);
		if (!uploadDir.exists()) {
			uploadDir.mkdirs();
		}
		String filename = image.getOriginalFilename();
		String filePath = webappPath + filename;
		File targetFile = new File(filePath);
		image.transferTo(targetFile);
		return "/images/" + filename;
	}

	private UserRolesEnum getUserRole(String role) {
		return UserRolesEnum.getUserRolesEnum(role);
	}

	@GetMapping("getVehicles")
	public ResponseEntity<Object> getVehicles(@RequestParam String userId, @RequestParam String userRole) {
		UserRolesEnum role = getUserRole(userRole);
		List<Vehicle> vehiclesList = null;
		if(role == UserRolesEnum.SELLER) {
			Seller sellerDetails = sellerRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
			vehiclesList = vehicleRepository.findBySellerId(sellerDetails.getId());
		} else if(role == UserRolesEnum.BUYER) {
			vehiclesList = vehicleRepository.findByStatusAndPurchaseStatus(VehicleStatusEnum.APPROVED.getStatus(), PurchaseStatusEnum.AVAILABLE.getStatus());
		} else {
			vehiclesList = vehicleRepository.findAll();
		}
		if (vehiclesList.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NO_CONTENT).body(CommonConstants.NO_VEHICLES_FOUND);
		}
		return ResponseEntity.ok(vehiclesList);
	}

	@PutMapping("updateVehicle/{vehicleId}")
	public ResponseEntity<String> updateVehicle(@PathVariable String vehicleId, @RequestParam("vehicle") String vehicleJson,
			@RequestParam String userId, @RequestParam(required = false,name = "image") MultipartFile image) {
		Seller sellerDetails = sellerRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
		UserRolesEnum role = getUserRole(sellerDetails.getRole());
		Vehicle vehicleDetails = vehicleRepository.findById(vehicleId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.VEHICLE_NOT_FOUND));
		if (role != UserRolesEnum.SELLER || !Objects.equals(sellerDetails.getId(), vehicleDetails.getSellerId())) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(CommonConstants.USER_HAS_NO_RIGHTS_TO_UPDATE_VEHICLE);
		}
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			Vehicle vehicle = objectMapper.readValue(vehicleJson, Vehicle.class);
			vehicleDetails.setCarModel(vehicle.getCarModel());
			vehicleDetails.setCarMake(vehicle.getCarMake());
			vehicleDetails.setCarPrice(vehicle.getCarPrice());
			if(image != null) {
				String imagePath = saveImage(image);
				vehicleDetails.setImage(imagePath);
			}
			vehicleDetails.setYearOfManufacture(vehicle.getYearOfManufacture());
			vehicleDetails.setRegistrationNumber(vehicle.getRegistrationNumber());
			vehicleDetails.setMileage(vehicle.getMileage());
			vehicleDetails.setLicensePlate(vehicle.getLicensePlate());
			vehicleDetails.setStatus(VehicleStatusEnum.INITIATED.getStatus());
			vehicleDetails.setReason(null);
			vehicleRepository.save(vehicleDetails);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(CommonConstants.INTERNAL_SERVER_ERROR);
		}
		return ResponseEntity.ok(CommonConstants.SUCCESSFULLY_UPDATED_VEHICLE_DETAILS);

	}

	@DeleteMapping("deleteVehicle/{id}")
	public ResponseEntity<String> deleteVehicle(@PathVariable String id) {
		Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.VEHICLE_NOT_FOUND));
		vehicleRepository.delete(vehicle);
		return ResponseEntity.ok(CommonConstants.SUCCESSFULLY_DELETED);
	}

	@PostMapping("approveVehicle/{vehicleId}")
	public ResponseEntity<String> approveVehicle(@PathVariable String vehicleId, @RequestParam String userId, @RequestParam String userRole, @RequestParam String commissionPercent) {
		UserRolesEnum role = getUserRole(userRole);
		if(role != UserRolesEnum.ADMIN) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(CommonConstants.USER_HAS_NO_RIGHTS_TO_APPROVE_VEHICLE);
		}
		Admin adminDetails = adminRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
		Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.VEHICLE_NOT_FOUND));
		vehicle.setCommisionPercentage(Integer.parseInt(commissionPercent));
		vehicle.setStatus(VehicleStatusEnum.APPROVED.getStatus());
		vehicle.setApprovedBy(adminDetails.getId());
		vehicleRepository.save(vehicle);
		return ResponseEntity.ok(CommonConstants.VEHICLE_APPROVED_SUCCESSFULLY);
	}

	@PostMapping("rejectVehicle/{vehicleId}")
	public ResponseEntity<String> rejectVehicle(@PathVariable String vehicleId, @RequestParam String userId, @RequestParam String userRole, @RequestParam String reason) {

		UserRolesEnum role = getUserRole(userRole);
		if(role != UserRolesEnum.ADMIN) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(CommonConstants.USER_HAS_NO_RIGHTS_TO_REJECT_VEHICLE);
		}
		Optional<Admin> adminDetails = adminRepository.findById(userId);
		if(!adminDetails.isPresent()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(CommonConstants.USER_NOT_FOUND);
		}
		Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.VEHICLE_NOT_FOUND));
		vehicle.setStatus(VehicleStatusEnum.REJECTED.getStatus());
		vehicle.setReason(reason);
		vehicleRepository.save(vehicle);
		return ResponseEntity.ok(CommonConstants.VEHICLE_REJECTED_SUCCESSFULLY);
	}

	@GetMapping("getVehiclesBySort")
	public ResponseEntity<List<Vehicle>> getVehiclesBySort(@RequestParam("sortBy") String sortBy, @RequestParam("sortOrder") String sortOrder) {
		Sort.Direction direction = Sort.Direction.ASC;
		if ("desc".equalsIgnoreCase(sortOrder)) {
			direction = Sort.Direction.DESC;
		}
		Sort sort = Sort.by(direction, sortBy);
		List<Vehicle> vehiclesList = vehicleRepository.findAll(sort);
		return ResponseEntity.ok(vehiclesList);
	}

	@GetMapping("/searchByCarName")
	public ResponseEntity<Object> searchByCarName(@RequestParam("searchKey") String carName, @RequestParam String userId, @RequestParam String userRole) {
		UserRolesEnum role = getUserRole(userRole);
		if(role == UserRolesEnum.SELLER) {
			return ResponseEntity.ok(vehicleRepository.findByCarMakeIsLikeIgnoreCaseAndSellerId(carName, userId));
		} else if(role == UserRolesEnum.BUYER) {
			return ResponseEntity.ok(vehicleRepository.findByCarMakeIsLikeIgnoreCaseAndStatus(carName, "A"));
		} else {
			return ResponseEntity.ok(vehicleRepository.findByCarMakeIsLikeIgnoreCase(carName));
		}
	}

	@GetMapping("/vehiclesByStatus")
	public ResponseEntity<Object> getVehiclesByStatus(@RequestParam List<String> statusList ,@RequestParam String userId, @RequestParam String userRole) {
		Map<String, Object> response = new HashMap<>();
		UserRolesEnum role = getUserRole(userRole);
		if(role == UserRolesEnum.SELLER) {
			response.put("vehiclesList", vehicleRepository.findByStatusInAndSellerId(statusList, userId));
			response.put("vehiclesCount", vehicleRepository.countBySellerId(userId));
		} 
		if(role == UserRolesEnum.ADMIN){
			response.put("vehiclesList", vehicleRepository.findByStatusIn(statusList));
			response.put("vehiclesCount", vehicleRepository.count());
		}
		return ResponseEntity.ok(response);
	}
}
