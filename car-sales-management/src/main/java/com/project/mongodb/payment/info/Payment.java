package com.project.mongodb.payment.info;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "payment")
public class Payment {
	
	@Id
	private String id;
	private String vehicleId;
	private String buyerId;
	private String paymentType;
	private double transactionAmount;

}
