package com.project.mongodb.order;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface OrderRequestRepository extends MongoRepository<OrderRequest, String> {

	List<OrderRequest> findBySellerIdOrderByRequestedDateDesc(String id);

	List<OrderRequest> findByBuyerIdOrderByRequestedDateDesc(String id);

	List<OrderRequest> findAllByOrderByRequestedDateDesc();

	List<OrderRequest> getOrderRequestsByVehicleIdAndOrderStatus(String vehicleId, String orderStatus);

	List<OrderRequest> findByBuyerIdAndOrderStatusOrOrderStatus(String buyerId, String status1, String status2);
}
