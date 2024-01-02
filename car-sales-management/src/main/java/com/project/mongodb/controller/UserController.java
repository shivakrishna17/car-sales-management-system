package com.project.mongodb.controller;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.mongodb.constants.CommonConstants;
import com.project.mongodb.enums.UserRolesEnum;
import com.project.mongodb.exception.ResourceNotFoundException;
import com.project.mongodb.order.OrderRequest;
import com.project.mongodb.order.OrderRequestRepository;
import com.project.mongodb.user.User;
import com.project.mongodb.user.admin.Admin;
import com.project.mongodb.user.admin.AdminRepository;
import com.project.mongodb.user.buyer.Buyer;
import com.project.mongodb.user.buyer.BuyerRepository;
import com.project.mongodb.user.seller.Seller;
import com.project.mongodb.user.seller.SellerRepository;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

	@Autowired
	private BuyerRepository buyerRepository;

	@Autowired
	private SellerRepository sellerRepository;

	@Autowired
	private AdminRepository adminRepository;

	@Autowired
	private OrderRequestRepository orderRequestRepository;

	@PostMapping("register")
	public ResponseEntity<String> register(@RequestBody User user) {
		if (Objects.equals(user.getRole(), UserRolesEnum.BUYER.getRole())) {
			Buyer existingBuyer = buyerRepository.getBuyerByUsername(user.getUsername());
			if (existingBuyer == null) {
				Buyer buyer = new Buyer();
				BeanUtils.copyProperties(user, buyer);
				buyer.setDateCreated(new Date());
				buyerRepository.save(buyer);
				return ResponseEntity.ok(CommonConstants.SUCCESSFULLY_REGISTERED);
			} else {
				return ResponseEntity.status(HttpStatus.CONFLICT).body(CommonConstants.USER_NAME_ALREADY_REGISTERED);
			}
		} else if (Objects.equals(user.getRole(), UserRolesEnum.SELLER.getRole())) {
			Seller existingSeller = sellerRepository.getSellerByUsername(user.getUsername());
			if (existingSeller == null) {
				Seller seller = new Seller();
				BeanUtils.copyProperties(user, seller);
				seller.setDateCreated(new Date());
				seller.setStatus("P");
				sellerRepository.save(seller);
				return ResponseEntity.ok(CommonConstants.SUCCESSFULLY_REGISTERED);
			} else {
				return ResponseEntity.status(HttpStatus.CONFLICT).body(CommonConstants.USER_NAME_ALREADY_REGISTERED);
			}
		} else {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(CommonConstants.INVALID_USER_ROLE);
		}
	}

	@PostMapping("login")
	public ResponseEntity<Object> login(@RequestBody User user) {
		if (user.getPassword() == null || user.getUsername() == null || user.getRole() == null) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(CommonConstants.PROVIDE_PROPER_INPUT);
		}
		if (Objects.equals(user.getRole(), UserRolesEnum.BUYER.getRole())) {
			return authenticateAndRespond(user, buyerRepository.getBuyerByUsername(user.getUsername()));
		} else if (Objects.equals(user.getRole(), UserRolesEnum.SELLER.getRole())) {
			Seller sellerDetails = sellerRepository.getSellerByUsername(user.getUsername());
			if (sellerDetails == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(CommonConstants.USER_NOT_FOUND);
			}
			if (!sellerDetails.getPassword().equals(user.getPassword())) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(CommonConstants.INCORRECT_PASSWORD);
			}
			if ("P".equals(sellerDetails.getStatus())) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(CommonConstants.USER_NOT_VERIFIED);
			} 
			if ("R".equals(sellerDetails.getStatus())) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(CommonConstants.USER_REJECTED_BY_ADMIN);
			} 
			return ResponseEntity.ok(sellerDetails);
		} else {
			return authenticateAndRespond(user, adminRepository.getAdminByUsername(user.getUsername()));
		}
	}

	private ResponseEntity<Object> authenticateAndRespond(User userRequest, User userDetails) {
		if (userDetails == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(CommonConstants.USER_NOT_FOUND);
		} else if (!userDetails.getPassword().equals(userRequest.getPassword())) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(CommonConstants.INCORRECT_PASSWORD);
		} else {
			return ResponseEntity.ok(userDetails);
		}
	}

	@PostMapping("addBalance/{userId}")
	public ResponseEntity<Object> addBalance(@PathVariable String userId, @RequestParam("userRole") String userRole,
			@RequestParam("amount") String amount) {
		if (Objects.equals(userRole, UserRolesEnum.BUYER.getRole())) {
			Buyer buyerDetails = buyerRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
			buyerDetails.setBalance(buyerDetails.getBalance() + Double.valueOf(amount));
			Buyer buyerResponse = buyerRepository.save(buyerDetails);
			return ResponseEntity.ok(buyerResponse);
		} else if (Objects.equals(userRole, UserRolesEnum.SELLER.getRole())) {
			Seller sellerDetails = sellerRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
			sellerDetails.setBalance(sellerDetails.getBalance() + Double.valueOf(amount));
			Seller sellerResponse = sellerRepository.save(sellerDetails);
			return ResponseEntity.ok(sellerResponse);
		} else {
			Admin adminDetails = adminRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
			adminDetails.setBalance(adminDetails.getBalance() + Double.valueOf(amount));
			Admin adminResponse = adminRepository.save(adminDetails);
			return ResponseEntity.ok(adminResponse);
		}
	}

	@GetMapping("getUserDetails")
	public ResponseEntity<Object> getVehicles(@RequestParam String userId, @RequestParam String userRole) {
		if (Objects.equals(userRole, UserRolesEnum.SELLER.getRole())) {
			Seller sellerDetails = sellerRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
			return ResponseEntity.ok(sellerDetails);
		} else if (Objects.equals(userRole, UserRolesEnum.BUYER.getRole())) {
			Buyer buyerDetails = buyerRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
			return ResponseEntity.ok(buyerDetails);
		} else {
			Admin adminDetails = adminRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
			return ResponseEntity.ok(adminDetails);
		}
	}

	@GetMapping("getUserRequests")
	public ResponseEntity<List<String>> getUserRequests(@RequestParam String userId) {
		List<OrderRequest> orderRequests = orderRequestRepository.findByBuyerIdAndOrderStatusOrOrderStatus(userId, "I", "A");
		if(orderRequests.isEmpty()) {
			return new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);
		}
		List<String> vehicleIds = orderRequests.stream().map(eachOrderRequest -> eachOrderRequest.getVehicle().getId()).collect(Collectors.toList());
		return ResponseEntity.ok(vehicleIds);
	}

	@GetMapping("getSellerRequests")
	public ResponseEntity<Object> getSellerRequests() {
		List<Seller> sellerList = sellerRepository.findAll();
		if(sellerList.isEmpty()) {
			return new ResponseEntity<>(Collections.emptyList(), HttpStatus.OK);
		}
		return ResponseEntity.ok(sellerList);
	}

	@PostMapping("approveUser/{userId}")
	public ResponseEntity<String> approveUser(@PathVariable String userId) {
		Seller sellerDetails = sellerRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
		sellerDetails.setStatus("A");
		sellerRepository.save(sellerDetails);
		return ResponseEntity.ok(CommonConstants.USER_APPROVED_SUCCESSFULLY);
	}

	@PostMapping("rejectUser/{userId}")
	public ResponseEntity<String> rejectUser(@PathVariable String userId) {
		Seller sellerDetails = sellerRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
		sellerDetails.setStatus("R");
		sellerRepository.save(sellerDetails);
		return ResponseEntity.ok(CommonConstants.USER_REJECTED_SUCCESSFULLY);
	}
}
