import React from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as DoubleArrowLeft } from '../../assets/icons/double-arrow-left.svg';
import './style.css';


const GoBackBtn = () => {

	const history = useHistory();

	return (
		<button
			className="global-go-back-button"
			onClick={() => history.goBack()}>
			<DoubleArrowLeft fill="#ffffff" />
		</button>
	);

};


export default GoBackBtn;