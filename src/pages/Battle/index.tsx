import React from "react";
import GoBackBtn from '../../components/GoBackBtn';
import Nort from '../../nort/Nort';
import PlayerData from "../../nort/singletons/PlayerData";
import Vector2 from "../../nort/utils/Vector2";
import './style.css';


const Battle = () => {

	const { hull, turret } = PlayerData.getHullAndTurretForShipAtIndex(0);
	const gs = Nort.getGameState();


	gs.start(() => ({

		team1: [{
			hull,
			turret,
			color: PlayerData.color,
			pos: new Vector2(200, 0),
		}],

		team2: [{
			pos: new Vector2(-200, 0)
		}],

	}));


	return (
		<div id="battle" className="screen">
			
			<header>
				<GoBackBtn/>
			</header>

		</div>
	);
};


export default Battle;
