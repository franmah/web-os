import { useState } from 'react';
import { v4 } from 'uuid';
import { getRootAtSystemStart } from '../services/FileSystemService';
import { ExplorerFile } from '../types/system/file/ExplorerElement';
import {
	convertPathToFragments,
	getCurrentItemNameInPath,
	getFileExtension,
	getParentPath
} from '../services/file-system/FilePathService';
import { CommonFolderPaths } from '../constants/system/file-system/CommonFilePaths';
import { IconPaths } from '../constants/IconPaths';

export const useFileSystemContextState = () => {
	const rootFile: ExplorerFile = getRootAtSystemStart();

	const [getRoot, setRoot] = useState<() => ExplorerFile>(() => () => rootFile);

	let getDesktop = (): ExplorerFile => getRoot()?.children?.[0];

	// For a file will always have an extension. If there's no extension then it's a directory
	const isDirectory = (path: string): boolean => {
		const fileName = getCurrentItemNameInPath(path);
		return !fileName.includes('.');
	};

	const deleteFolderV2 = (path: string): Promise<void> => {
		return new Promise((resolve, reject) => {
			if (path === CommonFolderPaths.ROOT) reject();

			const parent = getParentPath(path);
			const parentNode = _getNodeFromPath(parent);
			const itemName = getCurrentItemNameInPath(path);

			parentNode.children = parentNode.children.filter(child => child.name !== itemName);

			resolve();
		});
	};

	const renameFolderV2 = (path: string, newName: string): Promise<void> => {
		if (path === CommonFolderPaths.ROOT) return Promise.resolve();

		const currentName = getCurrentItemNameInPath(path);
		if (currentName === newName) return Promise.resolve();

		const fragments = convertPathToFragments(path);
		const parentPath = fragments.at(-2);

		const parentNode = !parentPath ? getRoot() : _getNodeFromPath(parentPath);

		const nameAlreadyUsed = parentNode.children.find(child => child.name === newName);
		if (nameAlreadyUsed) {
			console.error(
				`Error changing name, name already used in parent node's children. New name: ${newName}, path: '${path}'.`
			);
			return Promise.reject();
		}

		const nodeName = fragments.at(-1) as string;
		const node = parentNode.children.find(child => child.name === nodeName);

		if (!node) {
			console.error(`Error changing name, can't find node. New name: ${newName}, path: '${path}'.`);
			return Promise.reject();
		}
		node.name = newName;
		return Promise.resolve();
	};

	const searchFolderV2 = (path: string, partialName: string): Promise<string[]> => {
		try {
			const fileNode = _getNodeFromPath(path);
			const filePaths: string[] = [];
			const MAX_SEARCH_DEPTH = 20; // How far down the file tree to search.
			partialName = partialName.toLowerCase();

			const searchNode = (node: ExplorerFile, level: number, currentPath: string) => {
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
			const fileNode = _getNodeFromPath(path);
			return Promise.resolve(fileNode.children?.map(file => file.name) || []);
		} catch (error) {
			return Promise.reject(error);
		}
	};

	const mkdir = (path: string) => {
		setRoot(getRoot => {
			const root = getRoot();
			const parentPath = getParentPath(path);
			const parentNode = _getNodeFromPath(parentPath);

			const file: ExplorerFile = {
				name: getCurrentItemNameInPath(parentPath),
				iconPath: IconPaths.FOLDER,
				parent: parentNode,
				children: [],
				id: v4(),
				isFolder: true
			};

			parentNode.children.push(file);

			getDesktop = () => root?.children?.[0];

			return () => root;
		});
	};

	const updateFile = (file: ExplorerFile, content: any) => {
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

		if (!await exists(path))
			throw Error('Parent directory does not exist.');

		const parentNode = _getNodeFromPath(parentPath);
		const file: ExplorerFile = {
			children: [],
			content,
			extension: getFileExtension(getCurrentItemNameInPath(path)),
			iconPath: '',
			id: v4(),
			isFolder: false,
			name: getCurrentItemNameInPath(path),
			parent: parentNode
		};

		parentNode.children.push(file);
	};

	const exists = (path: string): Promise<boolean> => {
		if (path.at(-1) === '/')
			path = path.substring(0, path.length - 1);

		const fragments = convertPathToFragments(path);
		let fileNode = getRoot();

		for (const folder of fragments) {
			const childNode = fileNode.children?.find(file => file.name === folder);
			if (!childNode)
				return Promise.resolve(false);
			fileNode = childNode;
		}

		return Promise.resolve(true);
	};

	const _getNodeFromPath = (path: string): ExplorerFile => {
		if (path.at(-1) === '/')
			path = path.substring(0, path.length - 1);

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
		readdirV2,
		renameFolderV2,
		searchFolderV2,
		updateFile
	};
};
