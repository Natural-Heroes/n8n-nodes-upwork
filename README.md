# n8n-nodes-upwork

This is an n8n community node for integrating with the [Upwork API](https://www.upwork.com/developer/documentation/graphql/api/docs/index.html). It allows you to manage job postings and proposals directly from your n8n workflows.

## Features

### Resources

- **Proposal** - Manage freelancer proposals on your job postings
- **Job Post** - Create and manage job postings

### Operations

| Resource | Operation | Description |
|----------|-----------|-------------|
| Proposal | Get Many | List all proposals for a job posting |
| Proposal | Get | Get details of a single proposal |
| Job Post | Create | Create a new job posting |

## Prerequisites

Before using this node, you need to:

1. **Register an Upwork API application** at [Upwork Developer Portal](https://www.upwork.com/developer/keys/apply)
2. **Obtain OAuth 2.0 credentials** (Client ID and Client Secret)
3. **Get your Organization ID** (Tenant ID) from your Upwork account

## Installation

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes** in your n8n instance
2. Click **Install a community node**
3. Enter `n8n-nodes-upwork`
4. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-upwork
```

## Credentials

To authenticate with Upwork:

1. In n8n, go to **Credentials**
2. Click **Add Credential**
3. Search for **Upwork OAuth2 API**
4. Fill in your credentials:
   - **Client ID**: Your Upwork API Client ID
   - **Client Secret**: Your Upwork API Client Secret
   - **Organization ID**: Your Upwork Organization/Tenant ID

## Usage Examples

### List All Active Proposals for a Job

1. Add the **Upwork** node to your workflow
2. Select **Proposal** as the resource
3. Select **Get Many** as the operation
4. Enter the **Job Posting ID**
5. Optionally filter by status (Active, Hired, etc.)

### Get Proposal Details

1. Add the **Upwork** node to your workflow
2. Select **Proposal** as the resource
3. Select **Get** as the operation
4. Enter the **Proposal ID**

### Create a Job Posting

1. Add the **Upwork** node to your workflow
2. Select **Job Post** as the resource
3. Select **Create** as the operation
4. Fill in the job details:
   - Title
   - Description
   - Job Type (Hourly or Fixed)
   - Budget/Rate information
   - Additional options (duration, experience level, skills, visibility)

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/n8n-nodes-upwork.git
cd n8n-nodes-upwork

# Install dependencies
pnpm install

# Build the node
pnpm build

# Run in development mode
pnpm dev
```

### Testing Locally

The `pnpm dev` command will start a local n8n instance with your node loaded. Access it at `http://localhost:5678`.

## Resources

- [Upwork API Documentation](https://www.upwork.com/developer/documentation/graphql/api/docs/index.html)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Upwork Developer Portal](https://www.upwork.com/developer)

## License

MIT

## Author

Built with ❤️ for the n8n community


