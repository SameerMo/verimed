// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Verimed {
    enum Role { None, Patient, Doctor }

    mapping(address => Role) public roles;
    mapping(bytes32 => bool) public recordHashes;

    event RoleAssigned(address indexed user, Role role);
    event NewRecord(address indexed patient, bytes32 dataHash);

    modifier onlyPatient() {
        require(roles[msg.sender] == Role.Patient, "Not authorized: Patient only");
        _;
    }

    function setRole(Role _role) external {
        require(roles[msg.sender] == Role.None, "Role already assigned");
        require(_role == Role.Patient || _role == Role.Doctor, "Invalid role");
        roles[msg.sender] = _role;
        emit RoleAssigned(msg.sender, _role);
    }

    function addHash(bytes32 _hash) external onlyPatient {
        require(!recordHashes[_hash], "Hash already exists");
        recordHashes[_hash] = true;
        emit NewRecord(msg.sender, _hash);
    }

    function getRole(address user) external view returns (Role) {
        return roles[user];
    }
}
