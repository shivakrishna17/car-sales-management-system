package com.project.mongodb.order;

import java.util.Date;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.project.mongodb.address.Address;
import com.project.mongodb.vehicle.Vehicle;

import lombok.Data;

@Data
@Document(collection = "order_request")
public class OrderRequest {

	@Id
	private String id;
	private String buyerId;
	private String buyerName;
	private String sellerId;
	private String sellerName;
	private Vehicle vehicle;
	private Address address;
	private String orderStatus;
	private double payablePrice;
	private Date requestedDate;
	private Date soldDate;
	private double shippingCharges;
	private double totalPrice;
}
