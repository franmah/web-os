import { FC, useEffect, useState } from "react";
import Image from 'next/image';
import { convertPathToFragments } from "../../../services/file-system/FilePathService";
import { toDateModifedFormat } from "../../../services/date-service";

export const ExplorerFileViewRow : FC<{
  isSelected: boolean,
  path: string,
  onFileSelected: (path: string, selected: boolean) => void
}> = ({
  isSelected,
  path,
  onFileSelected
}) => {

  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    const fragmentedPath = convertPathToFragments(path);
    setFileName(fragmentedPath[fragmentedPath.length - 1]);
  })
  return (
    <tr
      className={'row ' + (isSelected ? 'selected-row' : '')}
      onClick={() => onFileSelected(path, true)}
    >
      <td className="first-column">
        <input
          type='checkbox'
          checked={!isSelected}
          onChange={e => onFileSelected(path, e.target.checked)}
        />
        <Image src='/icons/folder-icon.png' alt='folder icon' height={23} width={23} className="icon"/>
        { fileName }
      </td>
      <td>{ toDateModifedFormat(new Date()) }</td>
      <td>File folder</td>
      <td></td>
    </tr>
  );
};