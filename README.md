# Console Plugin OpenProject

Plugin pour gérer les correspondances projets et utilisateurs entre la console CPN et OpenProject.

Ce plugin est connecté aux hooks suivants:
- upsertProject
- deleteProject

## Hooks
### upsertProject

Pour toute modification de projet, le plugin va faire les actions suivantes:
- Créer le projet côté OpenProject si inexistant depuis un template en tant que sous-projet d'un projet racine (voir variables d'environnement)
- Détecter les utilisateurs déjà présents et les comparer avec la liste des utilisateurs reliés au projet sur la console CPN
- Ajouter / Supprimer les utilisateurs en fonction de la comparaison précédente

### deleteProject

Quand un projet est archivé dans la console, cela supprime purement et simplement le projet d'OpenProject

## Utilisation

Le plugin attend certaines variables d'environnement pour fonctionner:
- `OPENPROJECT_BASE_URL`: URL vers l'API d'OpenProject (https://<openproject_url>/api/v3/)
- `OPENPROJECT_USERNAME`: login du compte robot
- `OPENPROJECT_PASSWORD`: mot de passe du compte robot
- `TEMPLATE_PROJECT_ID`: Template du projet (son ID) à copier (voir [documentation](https://www.openproject.org/docs/api/endpoints/projects/#create-project-copy))
- `ANCESTOR_PROJECT_ID`: ID du projet racine
- `MEMBERSHIP_ROLE_ID`: ID du rôle que les utilisateurs auront

## Liens utiles

[Documentation API OpenProject](https://www.openproject.org/docs/api/endpoints/)

[Exemple sur GitHub](https://github.com/opf/openproject/blob/96a411dc7cd3350a969728e206a9befe3366cc1f/docs/api/apiv3/components/examples/membership-create-request-custom-message.yml)