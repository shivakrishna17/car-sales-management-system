package com.project.mongodb.controller;

import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.mongodb.address.Address;
import com.project.mongodb.address.AddressRepository;
import com.project.mongodb.constants.CommonConstants;
import com.project.mongodb.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/api/address")
@CrossOrigin(origins = "http://localhost:3000")
public class AddressController {

	@Autowired
	private AddressRepository addressRepository;

	@PostMapping("saveAddress")
	public ResponseEntity<String> saveAddress(@RequestBody Address address) {
		Address savedAddress = addressRepository.save(address);
		return ResponseEntity.ok(savedAddress.getId());
	}

	@GetMapping("getUserAddress/{userId}")
	public ResponseEntity<Object> getUserAddress(@PathVariable String userId) {
		List<Address> addressList = addressRepository.findByUserId(userId);
		if(addressList.isEmpty()) {
			return new ResponseEntity<>(Collections.emptyList(), HttpStatus.NO_CONTENT);
		}
		return ResponseEntity.ok(addressList);
	}
	
	@DeleteMapping("deleteAddress/{id}")
	public ResponseEntity<String> deleteVehicle(@PathVariable String id) {
		Address address = addressRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.ADDRESS_NOT_FOUND));
		addressRepository.delete(address);
		return ResponseEntity.ok(CommonConstants.SUCCESSFULLY_DELETED);
	}
}
