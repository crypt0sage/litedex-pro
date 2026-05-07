const now = Date.now();
const DAY = 86_400_000;

export const proposals = [
  {
    id: "prop-001",
    title: "LIP-12: Reduce LITESWAP Emission Rate by 20%",
    description:
      "This proposal aims to reduce the daily LITESWAP token emission rate from 100,000 to 80,000 tokens per day in order to create deflationary pressure and increase long-term token value. The reduction will be gradual over 30 days to minimize market disruption. Farming APRs will be recalculated proportionally. Community treasury allocation remains unchanged at 10% of emissions.",
    status: "active",
    votesFor: 8_420_000,
    votesAgainst: 2_310_000,
    endTime: new Date(now + 3 * DAY).toISOString(),
    proposer: "0x4f3c8b2a1d9e7f6a5c4b3a2d1e0f9c8b7a6d5e4f",
    quorum: 10_000_000,
    category: "Tokenomics",
    discussionUrl: "https://forum.litedex.io/t/lip-12",
    snapshotBlock: 4_480_000,
    created: new Date(now - 4 * DAY).toISOString(),
  },
  {
    id: "prop-002",
    title: "LIP-11: Add BNB/LTC Liquidity Pool",
    description:
      "Proposal to add a new BNB/LTC trading pair with a 0.30% fee tier to expand the Litecoin ecosystem. Initial liquidity mining incentives of 5x multiplier for the first 60 days. This will attract BNB holders looking for LTC exposure and increase cross-chain liquidity. Budget request: 500,000 LITESWAP from the community treasury for initial incentives.",
    status: "passed",
    votesFor: 14_200_000,
    votesAgainst: 1_080_000,
    endTime: new Date(now - 2 * DAY).toISOString(),
    proposer: "0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b",
    quorum: 10_000_000,
    category: "Protocol",
    discussionUrl: "https://forum.litedex.io/t/lip-11",
    snapshotBlock: 4_420_000,
    created: new Date(now - 9 * DAY).toISOString(),
  },
  {
    id: "prop-003",
    title: "LIP-10: Increase Protocol Fee to 0.05% for Treasury",
    description:
      "Proposal to introduce a 0.05% protocol fee on all swaps, redirected entirely to the LiteDEX DAO treasury. This sustainable revenue model will fund future development, security audits, and marketing without relying solely on token emissions. Estimated annual treasury revenue: $2.4M based on current volume. Fee will be taken from the existing 0.30% LP fee where applicable.",
    status: "failed",
    votesFor: 3_800_000,
    votesAgainst: 9_600_000,
    endTime: new Date(now - 7 * DAY).toISOString(),
    proposer: "0x1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d",
    quorum: 10_000_000,
    category: "Treasury",
    discussionUrl: "https://forum.litedex.io/t/lip-10",
    snapshotBlock: 4_360_000,
    created: new Date(now - 14 * DAY).toISOString(),
  },
  {
    id: "prop-004",
    title: "LIP-13: Launch LiteDEX V3 Concentrated Liquidity",
    description:
      "This proposal authorizes the core team to deploy LiteDEX V3 with concentrated liquidity positions, enabling LPs to provide liquidity within custom price ranges. Expected capital efficiency improvement of 4,000x in stable pairs and 10x in volatile pairs. Deployment timeline: 8 weeks from approval. V2 pools will continue operating in parallel for 6 months post-launch.",
    status: "pending",
    votesFor: 0,
    votesAgainst: 0,
    endTime: new Date(now + 10 * DAY).toISOString(),
    proposer: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f",
    quorum: 10_000_000,
    category: "Protocol",
    discussionUrl: "https://forum.litedex.io/t/lip-13",
    snapshotBlock: 4_510_000,
    created: new Date(now - 1 * DAY).toISOString(),
  },
  {
    id: "prop-005",
    title: "LIP-9: Strategic Partnership with Litecoin Foundation",
    description:
      "Proposal to formalize a strategic partnership with the Litecoin Foundation, allocating 2,000,000 LITESWAP tokens for joint marketing initiatives, hackathons, and developer grants. This partnership includes mutual promotion, technical collaboration on LTC payment integrations, and joint conference presence at Litecoin Summit 2024.",
    status: "passed",
    votesFor: 18_400_000,
    votesAgainst: 420_000,
    endTime: new Date(now - 15 * DAY).toISOString(),
    proposer: "0xd1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0",
    quorum: 10_000_000,
    category: "Partnership",
    discussionUrl: "https://forum.litedex.io/t/lip-9",
    snapshotBlock: 4_280_000,
    created: new Date(now - 22 * DAY).toISOString(),
  },
];

export const proposalMap = Object.fromEntries(proposals.map((p) => [p.id, p]));

export function getProposalById(id) {
  return proposalMap[id] || null;
}
