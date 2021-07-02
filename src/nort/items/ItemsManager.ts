import hulls, { HullItemType } from './hulls';
import turrets, { TurretItemType } from './turrets';



// Types

export type NortItem = HullItemType | TurretItemType;

export interface ItemReference {
	inInventoryID: string;
	itemID: number;
}

export interface InventoryItem <T = NortItem> {
	inInventoryID: string;
	item: T;
}



// Data

const all = verifyItemsList([...hulls, ...turrets]);


// Exports

const ItemsManager = {
	createInventoryItem,
};

export default ItemsManager;



// Methods


function createInventoryItem <T = NortItem> (

	data: {
		inInventoryID: string;
		item: NortItem | number;
	}

): InventoryItem<T> | null {

	const item = (
		typeof data.item === 'number'
		? getItemByID(data.item)
		: data.item
	) as T | null;

	if (item === null) {
		return null;
	}

	return {
		inInventoryID: data.inInventoryID,
		item,
	};

}



// Utils

function verifyItemsList (items: NortItem[]): NortItem[] {

	const idsMap: Record<number, NortItem[]> = {};
	const invalidIDs: NortItem[] = [];

	for (const item of items) {

		if (item.id < 1 || item.id !== parseInt(item.id.toString())) {
			invalidIDs.push(item);
		}

		if (item.id in idsMap) {
			idsMap[item.id].push(item);
		} else {
			idsMap[item.id] = [item];
		}
	}


	if (invalidIDs.length) {
		console.warn(`Found items with invalid ids: [${invalidIDs.join(', ')}]`);
	}


	// Check for multiple items with the same ID
	for (const id in idsMap) {
		if (idsMap[id].length > 1) {
			console.warn(`Found multiple items with id '${id}': [${idsMap[id].map(i => i.name).join(', ')}]`);
		}
	}


	// Check skipped ids (If there's an item with ID 2, and no item with ID 1)
	{
		const skippedIDs: number[] = [];
		const highestID = (
			Object
				.keys(idsMap)
				.map(Number)
				.sort((a, b) => a - b)[0]
		);

		for (let i = 1; i < highestID; i++) {
			if (typeof idsMap[i] === 'undefined') {
				skippedIDs.push(i);
			}
		}

		if (skippedIDs.length) {
			console.warn(`Skipped IDs: [${skippedIDs.join(', ')}]`);
		}
	}


	return items;

}


function getItemByID (id: number): NortItem | null {

	const item = all.find(item => item.id === id);

	if (typeof item === 'undefined') {
		console.warn(`No item with id: ${id}`);
		return null;
	}

	return item;

}
