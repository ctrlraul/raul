import { HullItemType } from "../items/hulls";
import { TurretItemType } from "../items/turrets";
import ItemsManager, { InventoryItem, NortItem } from "../items/ItemsManager";
import HSLA from "../utils/HSLA";



interface ItemReference {
  inInventoryID: string;
  item: number;
}

interface HullAndTurret {
  hull: HullItemType;
  turret: TurretItemType;
}



// Simulating data that should come from API or some shit like that

const iiID = ((i = 0) => () => (i++).toString())();

const hulls: ItemReference[] = [1, 4, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26].map(id => ({
  inInventoryID: iiID(),
  item: id,
}));

const turrets: ItemReference[] = [2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 27, 28].map(id => ({
  inInventoryID: iiID(),
  item: id,
}));



// Class

class _PlayerData {

  name = 'Ctrl-Raul';
  
  glory = 3000;
  level = 100;
  exp = 2000000;

  matter = 5000;
  chips = 400;
  tokens = 10;

  color = HSLA.random();

  hulls: InventoryItem<HullItemType>[] = [];
  turrets: InventoryItem<TurretItemType>[] = [];

  ships: {
    hull: string;
    turret: string;
  }[] = [];


  constructor () {

    this.hulls = (
      hulls
        .map(data => ItemsManager.createInventoryItem<HullItemType>(data))
        .filter(x => x !== null)
    ) as InventoryItem<HullItemType>[];

    this.turrets = (
      turrets
        .map(data => ItemsManager.createInventoryItem<TurretItemType>(data))
        .filter(x => x !== null)
    ) as InventoryItem<TurretItemType>[];

    this.ships = [{
      hull: this.hulls[0].inInventoryID,
      turret: this.turrets[0].inInventoryID,
    }];

  }



  // Methods

  public getHullAndTurretForShipAtIndex (index: number): HullAndTurret {

    const data = this.ships[index];

    if (!data) {
      throw new Error(`No ship at index [${index}]`);
    }

    const hull = this.getItemByInInventoryID<HullItemType>(data.hull);
    const turret = this.getItemByInInventoryID<TurretItemType>(data.turret);

    return {
      hull: hull.item,
      turret: turret.item,
    };

  }

  public setShipHull (shipIndex: number, inInventoryID: string): void {
    this.ships[shipIndex].hull = inInventoryID;
  }

  public setShipTurret (shipIndex: number, inInventoryID: string): void {
    this.ships[shipIndex].turret = inInventoryID;
  }


  public getItemByInInventoryID <T extends NortItem> (inInventoryID: string): InventoryItem<T> {
    const items = this.getAllInventoryItems();
    const item = items.find(x => x.inInventoryID === inInventoryID);

    if (!item) {
      throw new Error(`No item with in-inventory-id of '${inInventoryID}'`);
    }

    return item as InventoryItem<T>;
  }


  private getAllInventoryItems (): InventoryItem[] {
    return [...this.hulls, ...this.turrets];
  }

}


const PlayerData = new _PlayerData();


export default PlayerData;
