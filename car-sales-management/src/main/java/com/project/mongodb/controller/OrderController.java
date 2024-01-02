package com.project.mongodb.controller;

import java.text.DecimalFormat;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.project.mongodb.address.Address;
import com.project.mongodb.address.AddressRepository;
import com.project.mongodb.constants.CommonConstants;
import com.project.mongodb.enums.OrderStatusEnum;
import com.project.mongodb.enums.PurchaseStatusEnum;
import com.project.mongodb.enums.UserRolesEnum;
import com.project.mongodb.exception.ResourceNotFoundException;
import com.project.mongodb.order.OrderRequest;
import com.project.mongodb.order.OrderRequestRepository;
import com.project.mongodb.payment.info.Payment;
import com.project.mongodb.payment.info.PaymentRepository;
import com.project.mongodb.user.admin.Admin;
import com.project.mongodb.user.admin.AdminRepository;
import com.project.mongodb.user.buyer.Buyer;
import com.project.mongodb.user.buyer.BuyerRepository;
import com.project.mongodb.user.seller.Seller;
import com.project.mongodb.user.seller.SellerRepository;
import com.project.mongodb.vehicle.Vehicle;
import com.project.mongodb.vehicle.VehicleRepository;

@RestController
@RequestMapping("/api/order")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

	@Autowired
	private OrderRequestRepository orderRequestRepository;

	@Autowired
	private BuyerRepository buyerRepository;

	@Autowired
	private VehicleRepository vehicleRepository;

	@Autowired
	private AddressRepository addressRepository;

	@Autowired
	private SellerRepository sellerRepository;

	@Autowired
	private AdminRepository adminRepository;

	@Autowired
	private PaymentRepository paymentRepository;

	@PostMapping("createOrder/{vehicleId}")
	public ResponseEntity<String> createOrder(@PathVariable String vehicleId, @RequestParam("buyerId") String buyerId,
			@RequestParam("price") String price, @RequestParam("addressId") String addressId) {
		Vehicle vehicle = vehicleRepository.findById(vehicleId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.VEHICLE_NOT_FOUND));
		Buyer buyerDetails = buyerRepository.findById(buyerId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
		Seller sellerDetails = sellerRepository.findById(vehicle.getSellerId()).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
		Address addressDetails = addressRepository.findById(addressId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.ADDRESS_NOT_FOUND));
		OrderRequest orderRequest = new OrderRequest();
		orderRequest.setVehicle(vehicle);
		orderRequest.setBuyerId(buyerId);
		orderRequest.setBuyerName(buyerDetails.getName());
		orderRequest.setSellerId(sellerDetails.getId());
		orderRequest.setSellerName(sellerDetails.getName());
		orderRequest.setPayablePrice(Double.valueOf(price));
		orderRequest.setAddress(addressDetails);
		orderRequest.setOrderStatus(OrderStatusEnum.INITIATED.getStatus());
		orderRequest.setRequestedDate(new Date());
		orderRequestRepository.save(orderRequest);
		return ResponseEntity.ok(CommonConstants.ORDER_CREATED_SUCCESSFULLY);
	}

	@GetMapping("getAllOrderRequests/{userId}")
	public ResponseEntity<Object> getAllOrderRequests(@PathVariable String userId, @RequestParam("userRole") String role) {
		List<OrderRequest> orderRequests = null;
		if(Objects.equals(role, UserRolesEnum.SELLER.getRole())) {
			orderRequests = orderRequestRepository.findBySellerIdOrderByRequestedDateDesc(userId);
		} else if (Objects.equals(role,UserRolesEnum.BUYER.getRole())) {
			orderRequests = orderRequestRepository.findByBuyerIdOrderByRequestedDateDesc(userId);
		} else {
			orderRequests = orderRequestRepository.findAllByOrderByRequestedDateDesc();
		}
		if (orderRequests == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(CommonConstants.NO_ORDER_REQUESTS_FOUND);
		}
		return ResponseEntity.ok(orderRequests);
	}

	@PostMapping("approveOrder/{orderId}")
	public ResponseEntity<Object> approveOrder(@PathVariable String orderId, @RequestParam String shippingCharges) {
		OrderRequest orderDetails = orderRequestRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.ORDER_NOT_FOUND));
		orderDetails.setShippingCharges(Double.valueOf(shippingCharges));
		orderDetails.setTotalPrice(orderDetails.getPayablePrice() + Double.valueOf(shippingCharges));
		orderDetails.setOrderStatus(OrderStatusEnum.APPROVED.getStatus());
		orderRequestRepository.save(orderDetails);
		rejectRemainingRequests(orderDetails);
		return ResponseEntity.ok(CommonConstants.ORDER_APPROVED_SUCCESSFULLY);
	}

	@PostMapping("rejectOrder/{orderId}")
	public ResponseEntity<Object> rejectOrder(@PathVariable String orderId) {
		OrderRequest orderDetails = orderRequestRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.ORDER_NOT_FOUND));
		orderDetails.setOrderStatus(OrderStatusEnum.REJECTED.getStatus());
		orderRequestRepository.save(orderDetails);
		return ResponseEntity.ok(CommonConstants.ORDER_REJECTED_SUCCESSFULLY);
	}

	private void rejectRemainingRequests(OrderRequest orderDetails) {
		List<OrderRequest> orderRequests = orderRequestRepository.getOrderRequestsByVehicleIdAndOrderStatus(
				orderDetails.getVehicle().getId(), OrderStatusEnum.INITIATED.getStatus());
		orderRequests.forEach(eachOrderRequest -> {
			eachOrderRequest.setOrderStatus(OrderStatusEnum.REJECTED.getStatus());
			orderRequestRepository.save(eachOrderRequest);
		});

	}

	@PostMapping("confirmOrder/{orderId}")
	public ResponseEntity<String> confirmOrder(@PathVariable String orderId, @RequestParam("paymentType") String paymentType, @RequestParam("price") String price) {
		
		OrderRequest orderDetails = orderRequestRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.ORDER_NOT_FOUND));
		
		double payablePrice = orderDetails.getPayablePrice();
		double totalPrice = orderDetails.getTotalPrice();
		if(!paymentType.equals(CommonConstants.FULL_PAYMENT)) {
			totalPrice = Double.valueOf(price);
		}
		
		Buyer buyerDetails = buyerRepository.findById(orderDetails.getBuyerId()).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
		if (buyerDetails.getBalance() < totalPrice) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(CommonConstants.INSUFFICIENT_BALANCE);
		}
		
		//debit from buyer's account
		buyerDetails.setBalance(buyerDetails.getBalance() - totalPrice);
		buyerRepository.save(buyerDetails);
		
		double commissionPrice = calculateCommissionPrice(payablePrice, orderDetails.getVehicle());
		
		//credit to seller's account
		Seller sellerDetails = sellerRepository.findById(orderDetails.getSellerId()).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
		sellerDetails.setBalance(sellerDetails.getBalance() + (totalPrice - commissionPrice));
		sellerRepository.save(sellerDetails);

		//commissionPrice to admin
		Admin adminDetails = adminRepository.findById(orderDetails.getVehicle().getApprovedBy()).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.USER_NOT_FOUND));
		adminDetails.setBalance(adminDetails.getBalance() + commissionPrice);
		adminRepository.save(adminDetails);
		
		orderDetails.setOrderStatus(OrderStatusEnum.PAID.getStatus());
		orderDetails.setSoldDate(new Date());
		orderRequestRepository.save(orderDetails);
		
		//save payment Details
		Vehicle vehicle = orderDetails.getVehicle();
		vehicle.setPurchaseStatus(PurchaseStatusEnum.SOLD.getStatus());
		vehicle.setSoldDate(new Date());
		vehicleRepository.save(vehicle);
		
		Payment paymentDetails = new Payment();
		paymentDetails.setBuyerId(orderDetails.getBuyerId());
		paymentDetails.setPaymentType(paymentType);
		paymentDetails.setTransactionAmount(totalPrice);
		paymentDetails.setVehicleId(orderDetails.getVehicle().getId());
		paymentRepository.save(paymentDetails);
		
		return ResponseEntity.ok(CommonConstants.PAYMENT_SUCCESSFULL);
	}

	private double calculateCommissionPrice(double price, Vehicle vehicle) {
		DecimalFormat twoDForm = new DecimalFormat("#.##");
		return Double.valueOf(twoDForm.format((price * vehicle.getCommisionPercentage())/100));
	}

	@PostMapping("cancelOrder/{orderId}")
	public ResponseEntity<String> cancelOrder(@PathVariable String orderId) {
		OrderRequest order = orderRequestRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException(CommonConstants.ORDER_NOT_FOUND));
		order.setOrderStatus(OrderStatusEnum.CANCEL.getStatus());
		orderRequestRepository.save(order);
		return ResponseEntity.ok(CommonConstants.ORDER_CANCELLED_SUCCESSFULLY);
	}
}
