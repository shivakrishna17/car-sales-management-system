package com.project.mongodb.address;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Data;

@Data
@Document(collection = "address")
public class Address {

	@Id
	private String id;
	private String userId;
	private String address1;
	private String address2;
	private String city;
	private String state;
	private String zipcode;
}
