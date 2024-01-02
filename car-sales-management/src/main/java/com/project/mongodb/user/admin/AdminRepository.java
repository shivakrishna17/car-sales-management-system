package com.project.mongodb.user.admin;

import org.springframework.data.mongodb.repository.MongoRepository;

public interface AdminRepository extends MongoRepository<Admin, String>{

	Admin getAdminByUsername(String username);
}
