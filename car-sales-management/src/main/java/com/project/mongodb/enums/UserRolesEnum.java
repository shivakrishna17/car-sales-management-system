package com.project.mongodb.enums;

import java.util.HashMap;
import java.util.Map;

public enum UserRolesEnum {
	
	ADMIN("A"), SELLER("S"),BUYER("B");
	
	private final String role;

	UserRolesEnum(String roles) {
		this.role = roles;
	}

	public String getRole() {
		return role;
	}

	private static final Map<String, UserRolesEnum> lookup = new HashMap<>();
	static {
		for (UserRolesEnum userRole : UserRolesEnum.values()) {
			lookup.put(userRole.getRole(), userRole);
		}
	}

	public static UserRolesEnum getUserRolesEnum(String role) {
		return lookup.get(role);
	}

}
