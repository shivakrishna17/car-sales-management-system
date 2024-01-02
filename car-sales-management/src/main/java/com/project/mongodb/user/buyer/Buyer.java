package com.project.mongodb.user.buyer;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import com.project.mongodb.user.User;

@Document(collection = "Buyer")
public class Buyer extends User {

	@Id
	private String id;

	private double balance;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public double getBalance() {
		return balance;
	}

	public void setBalance(double balance) {
		this.balance = balance;
	}
}
