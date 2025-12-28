import { IsString, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { NpaTypeKZ } from '../domain/npa-types.enum';

export class AnalyzeRequestDto {
  @IsString()
  text: string;     

  @IsEnum(NpaTypeKZ)
  npa_type: NpaTypeKZ;
  @IsString()
  article: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  source_link?: string;
}

export enum ConflictSeverity {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

export enum LegalPrinciple {
  LEX_SUPERIOR = 'lex_superior', 
  LEX_SPECIALIS = 'lex_specialis',
  LEX_POSTERIOR = 'lex_posterior',
}

export class ConflictDetailDto {
  conflict_type: string;
  severity: ConflictSeverity;
  priority_rule: LegalPrinciple;
  legal_explanation: string;
  
  opposing_norm: {
    npa_name: string;
    article: string;
    text_snippet: string;
  };
}

export class AnalyzeResponseDto {
  jurisdiction: string;
  conflicts_found: boolean;
  conflicts: ConflictDetailDto[];
}