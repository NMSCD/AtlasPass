import { ResultWithValueAndPagination } from '../contracts/results/ResultWithValue';
import { BaseApiService } from './BaseApiService';
import { VersionViewModel } from '../contracts/generated/AssistantApps/ViewModel/Version/versionViewModel';
import { VersionSearchViewModel } from '../contracts/generated/AssistantApps/ViewModel/Version/versionSearchViewModel';

declare global {
    interface Window { config: any }
}

export class AssistantAppsApiService extends BaseApiService {
    constructor() {
        super(window.config?.assistantAppsUrl);
    }

    async getWhatIsNewItems(search: VersionSearchViewModel): Promise<ResultWithValueAndPagination<Array<VersionViewModel>>> {
        const result = await this.post<Array<VersionViewModel>, VersionSearchViewModel>(
            'Version/Search', search,
            (response: any) => {
                return {
                    ...response.data,
                    isSuccess: true,
                    errorMessage: '',
                };
            });

        if (result.isSuccess) return result as ResultWithValueAndPagination<Array<VersionViewModel>>;

        return {
            "currentPage": 1,
            "totalPages": 1,
            "totalRows": 5,
            "value": [
                {
                    "guid": "bb01b028-fb9b-47cf-9b15-88861181ddda",
                    "appGuid": "dca01b92-f458-4c49-eac5-7c5515722345",
                    "markdown": "- Use of AssistantApps API to track \"What is New\"",
                    "buildName": "0.1.25",
                    "buildNumber": 14,
                    "platforms": [
                        2
                    ],
                    "activeDate": "2022-08-12T21:00:00Z"
                },
                {
                    "guid": "dbefbfb6-5c5d-4a98-bb23-73b49ffb6514",
                    "appGuid": "dca01b92-f458-4c49-eac5-7c5515722345",
                    "markdown": "- Better mobile support\n- Added metadata for better SEO",
                    "buildName": "0.1.23",
                    "buildNumber": 13,
                    "platforms": [
                        2
                    ],
                    "activeDate": "2022-08-10T21:00:00Z"
                },
                {
                    "guid": "daaffd17-819d-409a-af7c-3f31d8efed90",
                    "appGuid": "dca01b92-f458-4c49-eac5-7c5515722345",
                    "markdown": "- Better z-index handling\n  - On adding item, use order added as z-index\n- Ability to select an element from the advanced elements list",
                    "buildName": "0.1.20",
                    "buildNumber": 12,
                    "platforms": [
                        2
                    ],
                    "activeDate": "2022-08-10T21:00:00Z"
                },
                {
                    "guid": "cb2dee84-575b-4acf-b47a-5b71474f6753",
                    "appGuid": "dca01b92-f458-4c49-eac5-7c5515722345",
                    "markdown": "- Faster grids\n- Ability to duplicate an item\n- Image flip horizontal & vertical\n- Added tooltips",
                    "buildName": "0.1.15",
                    "buildNumber": 11,
                    "platforms": [
                        2
                    ],
                    "activeDate": "2022-08-09T21:00:00Z"
                },
                {
                    "guid": "d61f424c-bbd7-4801-bf3f-5ebb665a4c1e",
                    "appGuid": "dca01b92-f458-4c49-eac5-7c5515722345",
                    "markdown": "- Added template builder\n- Ability to promote your favourite group",
                    "buildName": "0.1.11",
                    "buildNumber": 10,
                    "platforms": [
                        2
                    ],
                    "activeDate": "2022-08-08T18:00:00Z"
                }
            ],
            "isSuccess": true,
            "hasFailed": false,
            "exceptionMessage": "Initialized. Guid:cd2c81aa-4d0c-451e-bf17-e3a3b6f02893"
        } as any;
    }
}
