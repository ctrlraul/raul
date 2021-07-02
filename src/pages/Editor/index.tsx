import React, { useEffect, useState } from "react";
import GoBackBtn from '../../components/GoBackBtn';
import { NortItem } from "../../nort/items/ItemsManager";
import Nort from "../../nort/Nort";
import PlayerControl from "../../nort/PlayerControl";
import SpritesManager, { SpriteSourceData } from "../../nort/renderer/SpritesManager";
import PlayerData from "../../nort/singletons/PlayerData";
import './style.css';
import { HullItemType } from "../../nort/items/hulls";
import { TurretItemType } from "../../nort/items/turrets";
import Ship from "../../nort/ships/Ship";


const Editor = () => {

	const [shipData, setShipData] = useState(PlayerData.ships[0]);
	const [displayShip, setDisplayShip] = useState<Ship>();


	useEffect(() => {

		const hull = PlayerData.getItemByInInventoryID<HullItemType>(shipData.hull).item;
		const turret = PlayerData.getItemByInInventoryID<TurretItemType>(shipData.turret).item;
		const gs = Nort.getGameState();
		const lastShip = gs.ships[0];

		gs.clear();

		if (lastShip) {
			gs.addShip({
				hull,
				turret,
				hullAngle: lastShip.hullAngle,
				turretAngle: lastShip.turretAngle,
				color: lastShip.color,
			});
		} else {
			gs.addShip({
				hull,
				turret,
				color: PlayerData.color,
			});
		}

		PlayerControl.setBody(gs.ships[0]);

		setDisplayShip(gs.ships[0]);

	}, [shipData]);


	function drawSprite (canvas: HTMLCanvasElement | null, data: SpriteSourceData): void {
		if (canvas) {
			const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
			canvas.width = canvas.offsetWidth;
			canvas.height = canvas.offsetHeight;
			SpritesManager.drawRawItem(
				ctx,
				data,
				0,
				0,
				canvas.width,
				canvas.height,
			);
		}
	}

	function getItemStats (item: NortItem): string[] {
		return Object.entries(item.stats).map(x => x.join(': '));
	}


	if (!displayShip) {
		return null;
	}


	return (
		<div id="editor" className="screen">
			
			<header>
				<GoBackBtn/>
			</header>

			<main>
				<section className="stats">
					<div className="hull-stats">
						<header>
							<div className="canvas-container">
								<canvas ref={e => drawSprite(e, displayShip.hull.sprite)}></canvas>
							</div>
							<div className="info">
								{displayShip.hull.name} - Lvl 1
								<div>Tier {displayShip.hull.tier}</div>
							</div>
						</header>
						<ul>
							{getItemStats(displayShip.hull).map(stat =>
								<li key={stat}>{stat}</li>
							)}
						</ul>
					</div>
				</section>

				<section className="items">
					<ul>
						{PlayerData.hulls.map(({ inInventoryID, item }) =>
							<li
								key={inInventoryID}
								onClick={() => {
									PlayerData.setShipHull(0, inInventoryID);
									setShipData(data => {
										return { ...data, hull: inInventoryID }
									});
								}}>
								<canvas ref={e => drawSprite(e, item.sprite)}></canvas>
							</li>
						)}
					</ul>

					<ul>
						{PlayerData.turrets.map(({ inInventoryID, item }) => 
							<li
								key={inInventoryID}
								onClick={() => {
									PlayerData.setShipTurret(0, inInventoryID);
									setShipData(data => {
										return { ...data, turret: inInventoryID }
									});
								}}>
								<canvas ref={e => drawSprite(e, item.sprite)}></canvas>
							</li>
						)}
					</ul>
				</section>
			</main>

		</div>
	);
};


export default Editor;
