// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RehabCertificate {
    address public owner;

    struct Certificate {
        string certificateId;
        string patientName;
        string program;
        uint256 completionDate;
        bytes32 dataHash;
        bool exists;
    }

    mapping(string => Certificate) private certificates;

    event CertificateIssued(
        string certificateId,
        string patientName,
        string program,
        uint256 completionDate,
        bytes32 dataHash
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function issueCertificate(
        string memory _certificateId,
        string memory _patientName,
        string memory _program,
        uint256 _completionDate,
        bytes32 _dataHash
    ) public onlyOwner {
        require(!certificates[_certificateId].exists, "Already exists");

        certificates[_certificateId] = Certificate({
            certificateId: _certificateId,
            patientName: _patientName,
            program: _program,
            completionDate: _completionDate,
            dataHash: _dataHash,
            exists: true
        });

        emit CertificateIssued(
            _certificateId,
            _patientName,
            _program,
            _completionDate,
            _dataHash
        );
    }

    function verifyCertificate(string memory _certificateId)
        public
        view
        returns (
            string memory,
            string memory,
            uint256,
            bytes32
        )
    {
        require(certificates[_certificateId].exists, "Not found");
        Certificate memory cert = certificates[_certificateId];
        return (
            cert.patientName,
            cert.program,
            cert.completionDate,
            cert.dataHash
        );
    }
}