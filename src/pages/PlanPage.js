import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Container, Col } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import NavLink from 'react-bootstrap/NavLink';
import TabContainer from 'react-bootstrap/TabContainer'
import TabContent from 'react-bootstrap/TabContent';
import TabPane from 'react-bootstrap/TabPane'
import Spinner from '../components/Spinner';
import * as action from '../redux/action/index';
import PlanList from '../components/PlanList';
import { NavItem } from 'react-bootstrap';
import PlanDetails from '../components/PlanDetails';
import SearchBar from '../components/SearchBar';
import { matchString } from '../utilits';

class PlanPage extends Component {

    constructor(props) {
        super(props)

        this.state = {
            modalShow: false,
            bouquet_id: null,
            searchVal: ""
        }
    }

    componentDidMount() {
        if (Object.keys(this.props.bouquet).length <= 0) {
            this.props.fetchPlans();
        }
    }

    openChannelList = (id) => {
        this.setState({
            bouquet_id: id,
            modalShow: true,
        });

    };

    setModalShow = () => {
        this.setState({
            modalShow: !this.state.modalShow
        });
    }

    setSearchScope = () => {
        console.log("reset search state");
        this.setState({
            searchVal: ""
        });
    }

    handleSearch = (srch) => {
        this.setState({
            searchVal: srch
        });
    }


    render() {
        let contents = <Spinner />;

        if (Object.keys(this.props.bouquet).length > 0) {
            const baseList = this.props.bouquet.base.filter(e => {
                return matchString(e.name, this.state.searchVal);
            });
            const addonList = this.props.bouquet.addon.filter(e => {
                return matchString(e.name, this.state.searchVal);
            });
            const alacarteList = this.props.bouquet.alacarte.filter(e => {
                return matchString(e.name, this.state.searchVal);
            });

            contents = (
                <div className="card">
                    <TabContainer id="left-tabs-example" defaultActiveKey="first" variant="pills">
                        <div className="card-header">
                            <Container>
                                <Row>
                                    <Col xs={6}>
                                        <Nav variant="pills" className="flex-row nav nav-tabs Tab_header_tabs">
                                            <NavItem className="nav-item">
                                                <NavLink className="nav-link" eventKey="first" onClick={() => this.setSearchScope()}>Base</NavLink>
                                            </NavItem>
                                            <NavItem className="nav-item">
                                                <NavLink className="nav-link" eventKey="second" onClick={() => this.setSearchScope()}>Addon</NavLink>
                                            </NavItem>
                                            <NavItem className="nav-item">
                                                <NavLink className="nav-link" eventKey="third" onClick={() => this.setSearchScope()}>Alacarte</NavLink>
                                            </NavItem>
                                        </Nav>
                                    </Col>
                                    <Col>
                                        <SearchBar callback={this.handleSearch} searchVal={this.state.searchVal} />
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                        <div className="card-body">
                            <TabContent>
                                <TabPane eventKey="first">
                                    <PlanList bouquets={baseList} callback={this.openChannelList} />
                                </TabPane>
                                <TabPane eventKey="second">
                                    <PlanList bouquets={addonList} callback={this.openChannelList} />
                                </TabPane>
                                <TabPane eventKey="third">
                                    <PlanList bouquets={alacarteList} callback={this.openChannelList} />
                                </TabPane>
                            </TabContent>
                        </div>
                    </TabContainer>

                    {this.state.bouquet_id && <PlanDetails id={this.state.bouquet_id} modalShow={this.state.modalShow} setModalShow={this.setModalShow} />}
                </div>
            );
        }

        return (
            <div>
                <div className="page-header">
                    <h1 className="page-title">Plan List</h1>
                </div>
                <div className="row">
                    {contents}
                </div>
            </div >
        );
    }

}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        bouquet: state.plan.bouquet
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchPlans: () => dispatch(action.bouquet())
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(PlanPage)