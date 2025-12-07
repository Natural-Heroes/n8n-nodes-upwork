import type {
  IDataObject,
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';

export class Upwork implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Upwork',
    name: 'upwork',
    icon: 'file:upwork.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Upwork API to manage job posts and proposals',
    defaults: {
      name: 'Upwork',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'upworkOAuth2Api',
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: 'https://api.upwork.com/graphql',
      headers: {
        'Content-Type': 'application/json',
      },
    },
    properties: [
      // Resource Selection
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Job Post',
            value: 'jobPost',
          },
          {
            name: 'Proposal',
            value: 'proposal',
          },
        ],
        default: 'proposal',
      },

      // ============================================
      // Proposal Operations
      // ============================================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['proposal'],
          },
        },
        options: [
          {
            name: 'Get',
            value: 'get',
            description: 'Get a single proposal by ID',
            action: 'Get a proposal',
          },
          {
            name: 'Get Many',
            value: 'getMany',
            description: 'Get all proposals for a job posting',
            action: 'Get many proposals',
          },
        ],
        default: 'getMany',
      },

      // Proposal - Get Many Fields
      {
        displayName: 'Job Posting ID',
        name: 'jobPostingId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['proposal'],
            operation: ['getMany'],
          },
        },
        default: '',
        description: 'The ID of the job posting to get proposals for',
        placeholder: 'e.g., ~01abc123def456',
      },
      {
        displayName: 'Return All',
        name: 'returnAll',
        type: 'boolean',
        displayOptions: {
          show: {
            resource: ['proposal'],
            operation: ['getMany'],
          },
        },
        default: false,
        description: 'Whether to return all results or only up to a given limit',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        displayOptions: {
          show: {
            resource: ['proposal'],
            operation: ['getMany'],
            returnAll: [false],
          },
        },
        typeOptions: {
          minValue: 1,
          maxValue: 100,
        },
        default: 50,
        description: 'Max number of results to return',
      },
      {
        displayName: 'Filters',
        name: 'filters',
        type: 'collection',
        placeholder: 'Add Filter',
        default: {},
        displayOptions: {
          show: {
            resource: ['proposal'],
            operation: ['getMany'],
          },
        },
        options: [
          {
            displayName: 'Status',
            name: 'status',
            type: 'multiOptions',
            options: [
              { name: 'Active', value: 'ACTIVE' },
              { name: 'Archived', value: 'ARCHIVED' },
              { name: 'Declined', value: 'DECLINED' },
              { name: 'Hired', value: 'HIRED' },
              { name: 'Interviewing', value: 'INTERVIEWING' },
              { name: 'Offered', value: 'OFFERED' },
              { name: 'Pending', value: 'PENDING' },
              { name: 'Withdrawn', value: 'WITHDRAWN' },
            ],
            default: [],
            description: 'Filter proposals by status',
          },
        ],
      },

      // Proposal - Get Fields
      {
        displayName: 'Proposal ID',
        name: 'proposalId',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['proposal'],
            operation: ['get'],
          },
        },
        default: '',
        description: 'The ID of the proposal to retrieve',
        placeholder: 'e.g., ~01abc123def456',
      },

      // ============================================
      // Job Post Operations
      // ============================================
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['jobPost'],
          },
        },
        options: [
          {
            name: 'Create',
            value: 'create',
            description: 'Create a new job posting',
            action: 'Create a job post',
          },
        ],
        default: 'create',
      },

      // Job Post - Create Fields
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        required: true,
        displayOptions: {
          show: {
            resource: ['jobPost'],
            operation: ['create'],
          },
        },
        default: '',
        description: 'The title of the job posting',
        placeholder: 'e.g., Senior React Developer Needed',
      },
      {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
          rows: 5,
        },
        required: true,
        displayOptions: {
          show: {
            resource: ['jobPost'],
            operation: ['create'],
          },
        },
        default: '',
        description: 'Detailed description of the job',
      },
      {
        displayName: 'Job Type',
        name: 'jobType',
        type: 'options',
        required: true,
        displayOptions: {
          show: {
            resource: ['jobPost'],
            operation: ['create'],
          },
        },
        options: [
          { name: 'Fixed Price', value: 'FIXED' },
          { name: 'Hourly', value: 'HOURLY' },
        ],
        default: 'HOURLY',
        description: 'The type of job (hourly or fixed price)',
      },
      {
        displayName: 'Budget',
        name: 'budget',
        type: 'number',
        displayOptions: {
          show: {
            resource: ['jobPost'],
            operation: ['create'],
            jobType: ['FIXED'],
          },
        },
        default: 0,
        description: 'The fixed budget for the job in USD',
      },
      {
        displayName: 'Hourly Rate Range',
        name: 'hourlyRateRange',
        type: 'fixedCollection',
        displayOptions: {
          show: {
            resource: ['jobPost'],
            operation: ['create'],
            jobType: ['HOURLY'],
          },
        },
        default: {},
        options: [
          {
            name: 'range',
            displayName: 'Range',
            values: [
              {
                displayName: 'Minimum',
                name: 'min',
                type: 'number',
                default: 0,
                description: 'Minimum hourly rate in USD',
              },
              {
                displayName: 'Maximum',
                name: 'max',
                type: 'number',
                default: 0,
                description: 'Maximum hourly rate in USD',
              },
            ],
          },
        ],
        description: 'The hourly rate range for the job',
      },
      {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['jobPost'],
            operation: ['create'],
          },
        },
        options: [
          {
            displayName: 'Duration',
            name: 'duration',
            type: 'options',
            options: [
              { name: 'Less than 1 month', value: 'LESS_THAN_ONE_MONTH' },
              { name: '1-3 months', value: 'ONE_TO_THREE_MONTHS' },
              { name: '3-6 months', value: 'THREE_TO_SIX_MONTHS' },
              { name: 'More than 6 months', value: 'MORE_THAN_SIX_MONTHS' },
            ],
            default: 'ONE_TO_THREE_MONTHS',
            description: 'Expected duration of the job',
          },
          {
            displayName: 'Experience Level',
            name: 'experienceLevel',
            type: 'options',
            options: [
              { name: 'Entry Level', value: 'ENTRY_LEVEL' },
              { name: 'Intermediate', value: 'INTERMEDIATE' },
              { name: 'Expert', value: 'EXPERT' },
            ],
            default: 'INTERMEDIATE',
            description: 'Required experience level',
          },
          {
            displayName: 'Skills',
            name: 'skills',
            type: 'string',
            default: '',
            description: 'Comma-separated list of required skills',
            placeholder: 'e.g., JavaScript, React, Node.js',
          },
          {
            displayName: 'Visibility',
            name: 'visibility',
            type: 'options',
            options: [
              { name: 'Public', value: 'PUBLIC' },
              { name: 'Invite Only', value: 'INVITE_ONLY' },
              { name: 'Upwork Plus', value: 'UPWORK_PLUS' },
            ],
            default: 'PUBLIC',
            description: 'Who can see and apply to this job',
          },
        ],
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject | IDataObject[] = {};

        if (resource === 'proposal') {
          if (operation === 'getMany') {
            responseData = await executeProposalGetMany.call(this, i);
          } else if (operation === 'get') {
            responseData = await executeProposalGet.call(this, i);
          }
        } else if (resource === 'jobPost') {
          if (operation === 'create') {
            responseData = await executeJobPostCreate.call(this, i);
          }
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData),
          { itemData: { item: i } },
        );
        returnData.push(...executionData);
      } catch (error) {
        if (this.continueOnFail()) {
          returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}

async function executeProposalGetMany(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<IDataObject[]> {
  const jobPostingId = this.getNodeParameter('jobPostingId', itemIndex) as string;
  const returnAll = this.getNodeParameter('returnAll', itemIndex) as boolean;
  const limit = this.getNodeParameter('limit', itemIndex, 50) as number;
  const filters = this.getNodeParameter('filters', itemIndex, {}) as IDataObject;

  const filterInput: IDataObject = {};
  if (filters.status && (filters.status as string[]).length > 0) {
    filterInput.status = filters.status;
  }

  const query = `
    query clientProposals($jobPostingId: ID!, $filter: ClientProposalFilter, $first: Int, $after: String) {
      clientProposals(jobPostingId: $jobPostingId, filter: $filter, first: $first, after: $after) {
        edges {
          node {
            id
            user {
              id
              nid
              name
            }
            organization {
              id
              name
            }
            coverLetter
            terms {
              chargeRate {
                amount
                currency
              }
              estimatedDuration {
                weeks
              }
            }
            status
            createdDateTime
            projectPlan
            auditDetails {
              createdDateTime
              modifiedDateTime
            }
          }
          cursor
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  `;

  const allResults: IDataObject[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  while (hasNextPage) {
    const variables: IDataObject = {
      jobPostingId,
      first: returnAll ? 100 : Math.min(limit - allResults.length, 100),
    };

    if (Object.keys(filterInput).length > 0) {
      variables.filter = filterInput;
    }

    if (cursor) {
      variables.after = cursor;
    }

    const response = await this.helpers.requestOAuth2.call(this, 'upworkOAuth2Api', {
      method: 'POST',
      url: 'https://api.upwork.com/graphql',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const data = typeof response === 'string' ? JSON.parse(response) : response;

    if (data.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(data.errors)}`);
    }

    const proposals = data.data?.clientProposals;
    if (!proposals) {
      break;
    }

    for (const edge of proposals.edges || []) {
      allResults.push(edge.node as IDataObject);
    }

    hasNextPage = returnAll && proposals.pageInfo?.hasNextPage;
    cursor = proposals.pageInfo?.endCursor;

    if (!returnAll && allResults.length >= limit) {
      break;
    }
  }

  return returnAll ? allResults : allResults.slice(0, limit);
}

async function executeProposalGet(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<IDataObject> {
  const proposalId = this.getNodeParameter('proposalId', itemIndex) as string;

  const query = `
    query clientProposal($id: ID!) {
      clientProposal(id: $id) {
        id
        user {
          id
          nid
          name
          photoUrl
          title
          location {
            city
            country
          }
        }
        organization {
          id
          name
        }
        job {
          id
          title
        }
        coverLetter
        terms {
          chargeRate {
            amount
            currency
          }
          estimatedDuration {
            weeks
          }
        }
        status
        createdDateTime
        projectPlan
        auditDetails {
          createdDateTime
          modifiedDateTime
        }
        annotations
      }
    }
  `;

  const variables = { id: proposalId };

  const response = await this.helpers.requestOAuth2.call(this, 'upworkOAuth2Api', {
    method: 'POST',
    url: 'https://api.upwork.com/graphql',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data = typeof response === 'string' ? JSON.parse(response) : response;

  if (data.errors) {
    throw new Error(`GraphQL Error: ${JSON.stringify(data.errors)}`);
  }

  return (data.data?.clientProposal as IDataObject) || {};
}

async function executeJobPostCreate(
  this: IExecuteFunctions,
  itemIndex: number,
): Promise<IDataObject> {
  const title = this.getNodeParameter('title', itemIndex) as string;
  const jobDescription = this.getNodeParameter('description', itemIndex) as string;
  const jobType = this.getNodeParameter('jobType', itemIndex) as string;
  const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex, {}) as IDataObject;

  const input: IDataObject = {
    title,
    description: jobDescription,
    contractType: jobType,
  };

  if (jobType === 'FIXED') {
    const budget = this.getNodeParameter('budget', itemIndex, 0) as number;
    if (budget > 0) {
      input.budget = {
        amount: budget,
        currency: 'USD',
      };
    }
  } else if (jobType === 'HOURLY') {
    const hourlyRateRange = this.getNodeParameter('hourlyRateRange', itemIndex, {}) as IDataObject;
    if (hourlyRateRange.range) {
      const range = hourlyRateRange.range as IDataObject;
      input.hourlyBudget = {
        min: {
          amount: range.min,
          currency: 'USD',
        },
        max: {
          amount: range.max,
          currency: 'USD',
        },
      };
    }
  }

  if (additionalOptions.duration) {
    input.duration = additionalOptions.duration;
  }

  if (additionalOptions.experienceLevel) {
    input.experienceLevel = additionalOptions.experienceLevel;
  }

  if (additionalOptions.skills) {
    const skillsString = additionalOptions.skills as string;
    input.skills = skillsString.split(',').map((s: string) => s.trim());
  }

  if (additionalOptions.visibility) {
    input.visibility = additionalOptions.visibility;
  }

  const query = `
    mutation createJobPosting($input: CreateJobPostingInput!) {
      createJobPosting(input: $input) {
        jobPosting {
          id
          title
          description
          contractType
          visibility
          experienceLevel
          duration
          createdDateTime
          status
        }
      }
    }
  `;

  const variables = { input };

  const response = await this.helpers.requestOAuth2.call(this, 'upworkOAuth2Api', {
    method: 'POST',
    url: 'https://api.upwork.com/graphql',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const data = typeof response === 'string' ? JSON.parse(response) : response;

  if (data.errors) {
    throw new Error(`GraphQL Error: ${JSON.stringify(data.errors)}`);
  }

  return (data.data?.createJobPosting?.jobPosting as IDataObject) || {};
}
