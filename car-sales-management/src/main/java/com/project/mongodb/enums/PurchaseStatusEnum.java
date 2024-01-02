package com.project.mongodb.enums;

import java.util.HashMap;
import java.util.Map;

public enum PurchaseStatusEnum {

	AVAILABLE("A"), SOLD("S");

	private final String status;

	PurchaseStatusEnum(String status) {
		this.status = status;
	}

	public String getStatus() {
		return status;
	}

	private static final Map<String, PurchaseStatusEnum> lookup = new HashMap<>();

	static {
		for (PurchaseStatusEnum vehicleStatus : PurchaseStatusEnum.values()) {
			lookup.put(vehicleStatus.getStatus(), vehicleStatus);
		}
	}

	public static PurchaseStatusEnum getVehicleStatus(String status) {
		return lookup.get(status);
	}
}
