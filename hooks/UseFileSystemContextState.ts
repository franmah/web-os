import { useState } from 'react';
import { v4 } from 'uuid';
import { getRootAtSystemStart } from '../services/FileSystemService';
import { ExplorerItem } from '../types/system/file/ExplorerItem';
import {
	convertPathToFragments,
	getCurrentItemNameInPath,
	getParentPath
} from '../services/file-system/FilePathService';
import { CommonFolderPaths } from '../constants/system/file-system/CommonFilePaths';

export const useFileSystemContextState = () => {
	const rootFile: ExplorerItem = getRootAtSystemStart();

	const [getRoot, setRoot] = useState<() => ExplorerItem>(() => () => rootFile);

	let getDesktop = (): ExplorerItem => getRoot()?.children?.[0];

	// For now, a file will always have an extension. If there's no extension then it's a directory
	const isDirectory = (path: string): boolean => {
		if (path === CommonFolderPaths.ROOT) {
			return true;
		}
		const fileName = getCurrentItemNameInPath(path);
		return !fileName.includes('.');
	};

	const deleteFolderV2 = (path: string): Promise<void> => {
		return new Promise((resolve, reject) => {
			if (path === CommonFolderPaths.ROOT) reject();

			const parent = getParentPath(path);
			const parentNode = getNodeFromPath(parent);
			const itemName = getCurrentItemNameInPath(path);

			parentNode.children = parentNode.children.filter(child => child.name !== itemName);

			resolve();

			setRoot(() => () => getRoot()); // Triggers render
		});
	};

	const renameFolderV2 = (path: string, newName: string): Promise<void> => {
		if (path === CommonFolderPaths.ROOT) return Promise.resolve();

		const currentName = getCurrentItemNameInPath(path);
		if (currentName === newName) return Promise.resolve();

		const parentPath = getParentPath(path);

		const parentNode = !parentPath ? getRoot() : getNodeFromPath(parentPath);

		const nameAlreadyUsed = parentNode.children.find(child => child.name === newName);
		if (nameAlreadyUsed) {
			console.error(
				`Error changing name, name already used in parent node's children. New name: ${newName}, path: '${path}'.`
			);
			return Promise.reject();
		}

		const nodeName = getCurrentItemNameInPath(path);
		const node = parentNode.children.find(child => child.name === nodeName);

		if (!node) {
			console.error(`Error changing name, can't find node. New name: ${newName}, path: '${path}'.`);
			return Promise.reject();
		}
		node.name = newName;
		setRoot(() => () => getRoot());
		return Promise.resolve();
	};

	const searchFolderV2 = (path: string, partialName: string): Promise<string[]> => {
		try {
			const fileNode = getNodeFromPath(path);
			const filePaths: string[] = [];
			const MAX_SEARCH_DEPTH = 20; // How far down the file tree to search.
			partialName = partialName.toLowerCase();

			const searchNode = (node: ExplorerItem, level: number, currentPath: string) => {
				if (!node) return;

				if (level === MAX_SEARCH_DEPTH) return;

				if (node.name.toLowerCase().includes(partialName)) filePaths.push(currentPath);

				for (const child of node.children) {
					const childPath = currentPath + '/' + child.name;
					searchNode(child, level + 1, childPath);
				}
			};

			searchNode(fileNode, 0, path);

			return Promise.resolve(filePaths);
		} catch (error) {
			return Promise.reject(error);
		}
	};

	const readdirV2 = (path: string): Promise<string[]> => {
		try {
			const fileNode = getNodeFromPath(path);
			return Promise.resolve(fileNode.children?.map(file => file.name) || []);
		} catch (error) {
			return Promise.reject(error);
		}
	};

	/**
	 * @param path the path to the parent directory.
	 * @returns children of the directory as an ExplorerItem list.
	 */
	const opendir = (path: string): Promise<ExplorerItem[]> => {
		if (!isDirectory(path)) {
			return Promise.reject('Path is not a folder.');
		}

		const node = getNodeFromPath(path);
		return Promise.resolve(node.children || []);
	};

	const mkdir = async (path: string): Promise<void> => {
		setRoot(getRoot => {
			const root = getRoot();
			const parentPath = getParentPath(path);
			const parentNode = getNodeFromPath(parentPath);

			const file: ExplorerItem = {
				children: [],
				id: v4(),
				name: getCurrentItemNameInPath(path),
				parent: parentNode
			};

			parentNode.children.push(file);

			getDesktop = () => root?.children?.[0];
			return () => root;
		});
	};

	// TODO: remove
	const updateFile = (file: ExplorerItem, content: any) => {
		file.content = content;
	};

	// TODO: only creates a file, update to actually append
	const appendFileV2 = async (path: string, content?: any): Promise<void> => {
		if (path === CommonFolderPaths.ROOT) {
			return;
		}

		if (await exists(path)) {
			return;
		}
		const parentPath = getParentPath(path);

		if (!(await exists(parentPath))) throw Error('Parent directory does not exist.');

		const parentNode = getNodeFromPath(parentPath);
		const file: ExplorerItem = {
			children: [],
			content,
			id: v4(),
			name: getCurrentItemNameInPath(path),
			parent: parentNode
		};

		parentNode.children.push(file);

		setRoot(() => () => getRoot()); // Triggers render
	};

	const exists = (path: string): Promise<boolean> => {
		if (path.at(-1) === '/') path = path.substring(0, path.length - 1);

		const fragments = convertPathToFragments(path);
		let fileNode = getRoot();

		for (const folder of fragments) {
			const childNode = fileNode.children?.find(file => file.name === folder);
			if (!childNode) return Promise.resolve(false);
			fileNode = childNode;
		}

		return Promise.resolve(true);
	};

	const getNodeFromPath = (path: string): ExplorerItem => {
		if (path.at(-1) === '/') path = path.substring(0, path.length - 1);

		const fragments = convertPathToFragments(path);
		let fileNode = getRoot();

		for (const folder of fragments) {
			const childNode = fileNode.children?.find(file => file.name === folder);
			if (!childNode) throw Error(`Can't find directory ${folder} in path: ${path}`);
			fileNode = childNode;
		}

		return fileNode;
	};

	return {
		appendFileV2,
		deleteFolderV2,
		getDesktop,
		getRoot,
		isDirectory,
		mkdir,
		opendir,
		readdirV2,
		renameFolderV2,
		searchFolderV2,
		updateFile
	};
};
