package com.project.mongodb.user;

import java.util.Date;

import lombok.Data;

@Data
public class User {

	private String name;
	private String email;
	private String phonenumber;
	private String location;
	private String ssn;
	private String username;
	private String password;
	private String role;
	private Date dateCreated;

}
