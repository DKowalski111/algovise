package com.algovise.services;

import com.algovise.configs.PasswordEncoderConfig;
import com.algovise.dtos.CredentialsDto;
import com.algovise.dtos.SignUpDto;
import com.algovise.dtos.UserDto;
import com.algovise.entities.User;
import com.algovise.exceptions.AppException;
import com.algovise.mappings.UserMapper;
import com.algovise.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.CharBuffer;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService
{

	private static final String USER_NOT_FOUND_ERR_MSG = "User not found with id: %s";
	private static final String USER_NOT_FOUND_ERR_MSG_BY_NAME = "User not found";
	private final UserRepository userRepository;
	private final UserMapper userMapper;
	private final PasswordEncoder passwordEncoder;

	public UserDto login(final CredentialsDto credentialsDto)
	{
		User user = userRepository.findByName(credentialsDto.getName())
				.orElseThrow(() -> new AppException(USER_NOT_FOUND_ERR_MSG_BY_NAME, HttpStatus.NOT_FOUND));

		if(passwordEncoder.matches(CharBuffer.wrap(credentialsDto.getPassword()), user.getPassword())){
			return userMapper.toUserDto(user);
		}

		throw new AppException("Invalid password", HttpStatus.BAD_REQUEST);
	}

	public UserDto register(final SignUpDto signUpDto)
	{
		Optional<User> optionalUser = userRepository.findByName(signUpDto.getName());

		if(optionalUser.isPresent()){
			throw new AppException("User already exists", HttpStatus.BAD_REQUEST);
		}

		User user = userMapper.signUpToUser(signUpDto);
		user.setPassword(passwordEncoder.encode(CharBuffer.wrap(signUpDto.getPassword())));

		User savedUser = userRepository.save(user);

		return userMapper.toUserDto(savedUser);
	}

	public UserDto findByName(final String name) {
		User user = userRepository.findByName(name)
				.orElseThrow(() -> new AppException(USER_NOT_FOUND_ERR_MSG_BY_NAME, HttpStatus.NOT_FOUND));
		return userMapper.toUserDto(user);
	}

	public UserDto getUserById(final Long id) {
		final Optional<User> userOptional = userRepository.findById(id);
		final User user = userOptional.orElseThrow(() -> new RuntimeException(String.format(USER_NOT_FOUND_ERR_MSG, id)));
		return userMapper.toUserDto(user);
	}

	public List<UserDto> getAllUsers() {
		final List<User> users = userRepository.findAll();
		return users.stream().map(userMapper::toUserDto).collect(Collectors.toList());
	}

	public UserDto updateUser(final Long id, final UserDto userDto) {
		final User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException(String.format(USER_NOT_FOUND_ERR_MSG, id)));

		user.setName(userDto.getName());
		user.setEmail(userDto.getEmail());

		final User updatedUser = userRepository.save(user);
		return userMapper.toUserDto(updatedUser);
	}

	public void deleteUser(final Long id) {
		final User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException(String.format(USER_NOT_FOUND_ERR_MSG, id)));
		userRepository.delete(user);
	}

	public UserDto updateName(Long id, String newName) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found"));

		user.setName(newName);

		return userMapper.toUserDto(userRepository.save(user));
	}

	public UserDto updateEmail(Long id, String newEmail) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found"));

		user.setEmail(newEmail);

		return userMapper.toUserDto(userRepository.save(user));
	}

	public UserDto updatePassword(Long id, char[] password) {
		User user = userRepository.findById(id)
				.orElseThrow(() -> new RuntimeException("User not found"));

		user.setPassword(passwordEncoder.encode(CharBuffer.wrap(password)));

		return userMapper.toUserDto(userRepository.save(user));
	}
}
