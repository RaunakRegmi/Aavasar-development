import type { User } from "@prisma/client";
import { NotFoundError } from "@lib/errors";
import type { UserRepository } from "./user.repository";
import type { TalentFilters, TalentDto } from "./talent.contracts";

export class TalentService {
  constructor(private readonly repo: UserRepository) {}

  async list(filters: TalentFilters): Promise<{
    items: TalentDto[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;

    const [rows, total] = await this.repo.findStudents({
      query: filters.query,
      skills: filters.skills,
      page,
      pageSize,
    });

    return {
      items: rows.map(toTalentDto),
      total,
      page,
      pageSize,
    };
  }

  /** Single student profile for the recruiter-facing talent detail page. */
  async getById(id: string): Promise<TalentDto> {
    const row = await this.repo.findStudentById(id);
    if (!row) throw new NotFoundError("Student not found.");
    return toTalentDto(row);
  }
}

function toTalentDto(r: User): TalentDto {
  return {
    id: r.id,
    fullName: r.fullName,
    avatarUrl: r.avatarUrl,
    bannerUrl: r.bannerUrl,
    headline: r.headline,
    bio: r.bio,
    skills: r.skills,
    verified: r.verified,
  };
}
