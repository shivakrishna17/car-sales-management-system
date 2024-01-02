package com.project.mongodb.enums;

import java.util.HashMap;
import java.util.Map;

public enum VehicleStatusEnum {

	INITIATED("I"), APPROVED("A"), REJECTED("R");

	private final String status;

	VehicleStatusEnum(String status) {
		this.status = status;
	}

	public String getStatus() {
		return status;
	}

	private static final Map<String, VehicleStatusEnum> lookup = new HashMap<>();

	static {
		for (VehicleStatusEnum vehicleStatus : VehicleStatusEnum.values()) {
			lookup.put(vehicleStatus.getStatus(), vehicleStatus);
		}
	}

	public static VehicleStatusEnum getVehicleStatus(String status) {
		return lookup.get(status);
	}
}
