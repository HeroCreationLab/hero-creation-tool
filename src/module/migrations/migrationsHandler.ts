import { PrivateSettingKeys } from '../settings';
import { getModuleSetting, setModuleSetting } from '../utils';
import migration_1 from './migration_1';
import migration_2 from './migration_2';

export default async function performMigrations() {
  const lastMigration = getModuleSetting(PrivateSettingKeys.LAST_MIGRATION) as number;

  const allMigrations = [migration_1, migration_2];

  const migrationsToRun = allMigrations.slice(lastMigration);

  for (let i = 0; i < migrationsToRun.length; i++) {
    await migrationsToRun[i]();
    await setModuleSetting(PrivateSettingKeys.LAST_MIGRATION, allMigrations.indexOf(migrationsToRun[i]) + 1);
  }
}
