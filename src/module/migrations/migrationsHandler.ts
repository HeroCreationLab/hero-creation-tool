import { PrivateSettingKeys } from '../settings';
import { getModuleSetting, setModuleSetting } from '../utils';
import migration_1_sources_to_default from './migration_1_sources_to_default';
import migration_2_default_items_and_rules from './migration_2_default_items_and_rules';
import migration_3_advancements from './migration_3_advancements';

export default async function performMigrations() {
  const lastMigration = getModuleSetting(PrivateSettingKeys.LAST_MIGRATION) as number;

  const allMigrations = [migration_1_sources_to_default, migration_2_default_items_and_rules, migration_3_advancements];

  const migrationsToRun = allMigrations.slice(lastMigration);

  for (const migration of migrationsToRun) {
    await migration();
    await setModuleSetting(PrivateSettingKeys.LAST_MIGRATION, allMigrations.indexOf(migration) + 1);
  }
}
