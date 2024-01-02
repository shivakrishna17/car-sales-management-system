package com.project.mongodb.user.seller;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface SellerRepository extends MongoRepository<Seller, String> {

	Seller getSellerByUsername(String username);
}
