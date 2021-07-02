import React from "react";
import { Link } from 'react-router-dom';
import Nort from "../../nort/Nort";
import HSLA from "../../nort/utils/HSLA";
import Vector2 from "../../nort/utils/Vector2";
import RouteNames from "../RouteNames";
import './style.css';


const Menu = () => {

	const gs = Nort.getGameState();


	gs.start(() => ({

		team1: [{
			color: HSLA.random(),
			pos: new Vector2(-200, 0),
			invulnerable: true,
			showInfo: false,
		}],

		team3: [{
			color: HSLA.random(),
			pos: new Vector2(200, 0),
			invulnerable: true,
			showInfo: false,
		}],

	}));


	return (
		<div id="menu" className="screen">
			
			<div className="start-game-btns-container">
				<Link to={RouteNames.battle}>
					<button>1v1</button>
				</Link>
			</div>

			<footer>
				<Link to={RouteNames.editor}>
					<button className="basic-text-button">Ship Editor</button>
				</Link>
			</footer>

		</div>
	);
};


export default Menu;
