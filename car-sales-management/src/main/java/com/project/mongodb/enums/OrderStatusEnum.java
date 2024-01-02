package com.project.mongodb.enums;

import java.util.HashMap;
import java.util.Map;

public enum OrderStatusEnum {

	INITIATED("I"), APPROVED("A"), REJECTED("R"), PAID("P"), CANCEL("C"), PARTIALLYPAID("PP"),;

	private final String status;

	OrderStatusEnum(String status) {
		this.status = status;
	}

	public String getStatus() {
		return status;
	}

	private static final Map<String, OrderStatusEnum> lookup = new HashMap<>();

	static {
		for (OrderStatusEnum vehicleStatus : OrderStatusEnum.values()) {
			lookup.put(vehicleStatus.getStatus(), vehicleStatus);
		}
	}

	public static OrderStatusEnum getVehicleStatus(String status) {
		return lookup.get(status);
	}
}
