import { parse } from 'url';

export const getSoftwareAssets = {
  list: [
    {
      assetId: 'SF000001',
      assetSubCls: 'Soft',
      assetName: 'Jira Application1',
      vendorName: 'Atlassian',
      primaryTechOwner: 'IT',
      actualCost: 200000,
    },
    {
      assetId: 'SF000002',
      assetSubCls: 'Soft',
      assetName: 'Jira Application2',
      vendorName: 'Atlassian',
      primaryTechOwner: 'IT',
      actualCost: 200000,
    },
    {
      assetId: 'SF000003',
      assetSubCls: 'Soft',
      assetName: 'Jira Application3',
      vendorName: 'Atlassian',
      primaryTechOwner: 'IT',
      actualCost: 200000,
    },
    {
      assetId: 'SF000004',
      assetSubCls: 'Soft',
      assetName: 'Jira Application4',
      vendorName: 'Atlassian',
      primaryTechOwner: 'IT',
      actualCost: 200000,
    },
  ],
  pagination: {
    total: 4,
    pageSize: 10,
    current: 1,
  },
};

export default {
  getSoftwareAssets,
};
