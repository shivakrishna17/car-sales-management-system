package com.project.mongodb.vehicle;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "vehicles")
public class Vehicle {

	@Id
	private String id;
	private String carMake;
	private String carModel;
	private String image;
	private String registrationNumber;
	private int yearOfManufacture;
	private double carPrice;
	private String sellerId;
	private String buyerId;
	private int commisionPercentage;
	private String status;
	private String purchaseStatus;
	private Date soldDate;
	private String approvedBy;
	private Date dateCreated;
	private String licensePlate;
	private double mileage;
	private String reason;

}