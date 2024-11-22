package com.algovise.mappings;


import com.algovise.dtos.SignUpDto;
import com.algovise.dtos.UserDto;
import com.algovise.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper
{
	UserDto toUserDto(final User user);

	@Mapping(target = "password", ignore = true)
	User signUpToUser(final SignUpDto signUpDto);
}
