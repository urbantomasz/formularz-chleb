export interface CustomConfigDto {
  datesEnabled: boolean;         
  bannerEnabled: boolean;        
  bannerMessage?: string | null; 
  datesUtc: string[];            
}

export interface UpdateCustomConfigRequest {
  datesEnabled: boolean;
  bannerEnabled: boolean;
  bannerMessage?: string | null;
  datesUtc: string[];           
}