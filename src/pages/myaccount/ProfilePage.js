import React from 'react';
import { ListGroup } from 'react-bootstrap';

const ProfilePage = ({ profile }) => {
    const address = [];
    for (let addr in profile.address) {
        address.push((<ListGroup.Item>
            <span className="text-secondary" key={addr.toUpperCase()}>{addr.toUpperCase()}</span> :
            <span className="text-secondary" key={profile.address[addr]}>{profile.address[addr]}</span>
        </ListGroup.Item>))
    }

    return (
        <div>
            <div className="card mt-3">
                <div className="card-header">Profile</div>
                <div className="card-body">
                    <ListGroup>
                        <ListGroup.Item key="customer_id">
                            <h6 className="mb-0">Customer ID</h6>
                            <span className="text-secondary">{profile.customer_id}</span>
                        </ListGroup.Item>
                        <ListGroup.Item key="full_name">
                            <h6 className="mb-0">Full Name</h6>
                            <span className="text-secondary">{profile.name}</span>
                        </ListGroup.Item>
                        <ListGroup.Item key="mobile_no">
                            <h6 className="mb-0">Mobile No</h6>
                            <span className="text-secondary">{profile.mobile_no}</span>
                        </ListGroup.Item>
                        <ListGroup.Item key="email">
                            <h6 className="mb-0">Email</h6>
                            <span className="text-secondary">{profile.email}</span>
                        </ListGroup.Item>
                        <ListGroup.Item key="address">
                            <h6 className="mb-0">Address</h6>
                            <ListGroup>
                                {address}
                            </ListGroup>
                        </ListGroup.Item>
                        <ListGroup.Item key="connection_type">
                            <h6 className="mb-0"> Connection Type</h6>
                            <span className="text-secondary">{profile.customer_type}</span>
                        </ListGroup.Item>
                    </ListGroup>
                </div>


                <div className="card-body mt-3">
                    <ListGroup>
                        <ListGroup.Item key="service_provider">
                            <h6 className="mb-0">Service Provider</h6>
                            <span className="text-secondary">{profile.operator}</span>
                        </ListGroup.Item>
                        <ListGroup.Item key="contact_no">
                            <h6 className="mb-0">Contact no.</h6>
                            <span className="text-secondary">{profile.operator_contactno}</span>
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            </div>
        </div>
    );
}


export default ProfilePage;