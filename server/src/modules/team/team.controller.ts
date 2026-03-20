import { prisma } from "../../lib/prisma";
import { Response } from "express";
import { TypedRequest } from "../../types/request";
import {
  AddTeamMemberBody,
  CreateTeamBody,
  TeamIdParams,
  TeamMemberParams,
} from "./team.schema";

const teamSelect = {
  id: true,
  name: true,
  description: true,
  ownerId: true,
  createdAt: true,
  members: {
    select: {
      id: true,
      user: {
        select: { id: true, name: true, email: true, avatar: true },
      },
    },
  },
};

export async function getTeams(req: TypedRequest, res: Response) {
  try {
    const { id: userId } = req.user!;

    const teams = await prisma.team.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      select: teamSelect,
    });

    res.status(200).json({ message: "Fetched teams", teams });
  } catch (error) {
    console.log("GET_TEAMS_ERROR", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function createTeam(
  req: TypedRequest<{}, CreateTeamBody, {}>,
  res: Response,
) {
  try {
    const { id: userId } = req.user!;
    const { name, description, memberEmails } = req.body;

    const users = memberEmails.length
      ? await prisma.user.findMany({
          where: { email: { in: memberEmails }, NOT: { id: userId } },
          select: { id: true },
        })
      : [];

    const team = await prisma.team.create({
      data: {
        name,
        description: description ?? null,
        ownerId: userId,
        members: {
          create: users.map((u) => ({ userId: u.id })),
        },
      },
      select: teamSelect,
    });

    res.status(201).json({ message: "Team created", team });
  } catch (error) {
    console.log("CREATE_TEAM_ERROR", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function addTeamMember(
  req: TypedRequest<TeamIdParams, AddTeamMemberBody, {}>,
  res: Response,
) {
  try {
    const { id: ownerId } = req.user!;
    const { id: teamId } = req.params;
    const { email } = req.body;

    const team = await prisma.team.findFirst({
      where: { id: teamId, ownerId },
    });
    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User with this email not found" });
      return;
    }

    const existing = await prisma.teamMember.findUnique({
      where: { teamId_userId: { teamId, userId: user.id } },
    });
    if (existing) {
      res.status(409).json({ message: "User is already a member" });
      return;
    }

    const member = await prisma.teamMember.create({
      data: { teamId, userId: user.id },
      select: {
        id: true,
        user: { select: { id: true, name: true, email: true, avatar: true } },
      },
    });

    res.status(201).json({ message: "Member added", member });
  } catch (error) {
    console.log("ADD_TEAM_MEMBER_ERROR", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function removeTeamMember(
  req: TypedRequest<TeamMemberParams, {}, {}>,
  res: Response,
) {
  try {
    const { id: ownerId } = req.user!;
    const { id: teamId, memberId } = req.params;

    const team = await prisma.team.findFirst({
      where: { id: teamId, ownerId },
    });
    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    await prisma.teamMember.delete({ where: { id: memberId } });

    res.status(200).json({ message: "Member removed" });
  } catch (error) {
    console.log("REMOVE_TEAM_MEMBER_ERROR", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deleteTeam(
  req: TypedRequest<TeamIdParams, {}, {}>,
  res: Response,
) {
  try {
    const { id: ownerId } = req.user!;
    const { id } = req.params;

    const team = await prisma.team.findFirst({ where: { id, ownerId } });
    if (!team) {
      res.status(404).json({ message: "Team not found" });
      return;
    }

    await prisma.team.delete({ where: { id } });

    res.status(200).json({ message: "Team deleted" });
  } catch (error) {
    console.log("DELETE_TEAM_ERROR", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
