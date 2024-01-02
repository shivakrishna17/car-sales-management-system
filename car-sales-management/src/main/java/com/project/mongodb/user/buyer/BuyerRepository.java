package com.project.mongodb.user.buyer;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface BuyerRepository extends MongoRepository<Buyer, String>{

	Buyer getBuyerByUsername(String username);
}
