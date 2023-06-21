import { FC, useState } from "react";
import styled from "styled-components";
import { toDateModifedFormat } from "../../services/date-service";
import Image from 'next/image';

export const StyledExplorerFileView = styled.table`
  user-select: none;
  border-spacing: 0px;
  margin-left: 8px;
  margin-top: 8px;

  .row {
    &:hover {
      background-color: #e5f3ff;
    }
  }

  th {
    text-align: start;
    color: #515858;
    font-weight: normal;
    padding: 0px 4px;
    border-right: 1px solid #d9d9d9;

    &:hover {
      background-color: #e5f3ff;
    }
  }

  td {
    padding: 6px 4px;
  }

  .first-column {
    display: flex;
    align-items: center;

    .icon {
      margin-right: 2px;
    }
  }

  th, td {
    &:first-child {
      padding-right: 100px
    }
  }
`;

const ExplorerFileView: FC<{ path: string, children: string[] }> = ({ path, children }) => {

  const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

  const selectChild = (child: string, selected: boolean) => {
    setSelectedChildren(currentlySelectedChildren => {
      if (selected)
        return [...currentlySelectedChildren, child];
      else
        return [...currentlySelectedChildren].filter(c => c !== child);
    });
  }

  const selectAllChildren = (selected: boolean) => {
    if (selected)
      setSelectedChildren(children);
    else
      setSelectedChildren([]);
  }

  const getRow = (child :string) => {
    return (
      <>
        <td className="first-column">
          <input
            type='checkbox'
            checked={!!selectedChildren.find(c => c === child)}
            onChange={e => selectChild(child, e.target.checked)}
          />
          <Image src='/icons/folder-icon.png' alt='folder icon' height={23} width={23} className="icon"/>
          { child }
        </td>
        <td>{ toDateModifedFormat(new Date()) }</td>
        <td>File folder</td>
        <td></td>
      </>
    );
  }

  return (
    <StyledExplorerFileView>
      <thead>
        <tr className="header">
          <th>
            <input
              type='checkbox'
              checked={selectedChildren.length === children.length}
              onChange={e => selectAllChildren(e.target.checked)}
            />
            Name
          </th>
          <th>Date modified</th>
          <th>Type</th>
          <th>Size</th>
        </tr>
      </thead>

      <tbody>
        {
          children?.map(child => {
            return (
              <tr className="row" key={child}>
                { getRow(child) }
              </tr>
            );
          })
        }
      </tbody>
      
      
    </StyledExplorerFileView>
  )
};

export default ExplorerFileView;