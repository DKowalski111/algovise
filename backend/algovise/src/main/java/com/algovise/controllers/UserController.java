package com.algovise.controllers;

import com.algovise.configs.UserAuthenticationProvider;
import com.algovise.dtos.UpdateUserDto;
import com.algovise.dtos.UserDto;
import com.algovise.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequiredArgsConstructor
@RequestMapping(path = "/user")
public class UserController
{
	private final UserService userService;
	private final UserAuthenticationProvider userAuthenticationProvider;

	@GetMapping("/{id}")
	public ResponseEntity<UserDto> getUserById(@PathVariable final Long id) {
		final UserDto userDto = userService.getUserById(id);
		return new ResponseEntity<>(userDto, HttpStatus.OK);
	}

	@GetMapping
	public ResponseEntity<List<UserDto>> getAllUsers() {
		final List<UserDto> users = userService.getAllUsers();
		return new ResponseEntity<>(users, HttpStatus.OK);
	}

	@PutMapping("/{id}")
	public ResponseEntity<UserDto> updateUser(@PathVariable final Long id, @RequestBody final UserDto userDto) {
		final UserDto updatedUser = userService.updateUser(id, userDto);
		return new ResponseEntity<>(updatedUser, HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable final Long id) {
		userService.deleteUser(id);
		return new ResponseEntity<>(HttpStatus.NO_CONTENT);
	}

	@PostMapping("/update-name")
	public ResponseEntity<UserDto> updateName(@RequestBody final UpdateUserDto updateUserDto) {
		UserDto userDto = userService.updateName(updateUserDto.getId(), updateUserDto.getName());
		userDto.setToken(userAuthenticationProvider.createToken(userDto.getName()));
		return ResponseEntity.ok(userDto);
	}

	@PostMapping("/update-email")
	public ResponseEntity<UserDto> updateEmail(@RequestBody final UpdateUserDto updateUserDto) {
		UserDto userDto = userService.updateEmail(updateUserDto.getId(), updateUserDto.getEmail());
		return ResponseEntity.ok(userDto);
	}

	@PostMapping("/update-password")
	public ResponseEntity<UserDto> updatePassword(@RequestBody final UpdateUserDto updateUserDto) {
		UserDto userDto = userService.updatePassword(updateUserDto.getId(), updateUserDto.getPassword());
		return ResponseEntity.ok(userDto);
	}
}
