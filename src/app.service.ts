import { Injectable } from '@nestjs/common';
import { 
  AnalyzeRequestDto, 
  AnalyzeResponseDto, 
  ConflictDetailDto, 
  ConflictSeverity, 
  LegalPrinciple 
} from './dto/analysis.dto';
import { KZ_LAW_HIERARCHY, NpaTypeKZ } from './domain/npa-types.enum';

@Injectable()
export class AppService {
  
  analyze(dto: AnalyzeRequestDto): AnalyzeResponseDto {
    // FIX: Явно указываем тип
    const conflicts: ConflictDetailDto[] = []; 

    const inputWeight = KZ_LAW_HIERARCHY[dto.npa_type];
    const constitutionWeight = KZ_LAW_HIERARCHY[NpaTypeKZ.CONSTITUTION];

    if (inputWeight && inputWeight < constitutionWeight) {
      conflicts.push({
        conflict_type: 'Lex Superior Conflict',
        severity: ConflictSeverity.HIGH,
        priority_rule: LegalPrinciple.LEX_SUPERIOR,
        legal_explanation: 'Norma protivorechit Konstitucii RK (The norm contradicts the Constitution).',
        opposing_norm: {
          npa_name: 'Konstituciya RK',
          article: 'st. 12',
          text_snippet: 'Human rights and freedoms are guaranteed...'
        }
      });
    }

    return {
      jurisdiction: 'KZ',
      conflicts_found: conflicts.length > 0,
      conflicts: conflicts
    };
  }
}
