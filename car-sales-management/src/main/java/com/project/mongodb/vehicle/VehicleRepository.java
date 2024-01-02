package com.project.mongodb.vehicle;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface VehicleRepository extends MongoRepository<Vehicle, String> {

	public List<Vehicle> findBySellerId(String sellerId);

	public List<Vehicle> findByStatusAndPurchaseStatus(String status, String purchaseStatus);

	public List<Vehicle> findAll(Sort sort);

	public List<Vehicle> findByCarMakeIsLikeIgnoreCase(String carMake);

	public List<Vehicle> findByCarMakeIsLikeIgnoreCaseAndSellerId(String carMake, String sellerId);
	
	public List<Vehicle> findByCarMakeIsLikeIgnoreCaseAndStatus(String carMake, String status);

	public List<Vehicle> findByStatusIn(List<String> statusList);

	public List<Vehicle> findByStatusInAndSellerId(List<String> statusList, String sellerId);

	public Long countBySellerId(String sellerId);

}
