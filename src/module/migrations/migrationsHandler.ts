import { PrivateSettingKeys } from '../settings';
import { getModuleSetting, setModuleSetting } from '../utils';
import migration_1 from './migration_1';
import migration_2 from './migration_2';
import migration_3 from './migration_3';

export default async function performMigrations() {
  const lastMigration = getModuleSetting(PrivateSettingKeys.LAST_MIGRATION) as number;

  const allMigrations = [migration_1, migration_2, migration_3];

  const migrationsToRun = allMigrations.slice(lastMigration);

  for (const migration of migrationsToRun) {
    await migration();
    await setModuleSetting(PrivateSettingKeys.LAST_MIGRATION, allMigrations.indexOf(migration) + 1);
  }
}
