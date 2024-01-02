package com.project.mongodb.address;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface AddressRepository extends MongoRepository<Address, String> {

	List<Address> findByUserId(String userId);
}
