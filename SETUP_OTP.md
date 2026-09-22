# Configuration de l'authentification OTP

## 1. Configuration Supabase

### Templates d'email (Dashboard Supabase)

Allez dans votre dashboard Supabase > Authentication > Email Templates et configurez le template "Magic Link" :

**Subject :** `Code de connexion Reachly - {{ .Token }}`

**Body (HTML) :**
```html
<div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Reachly</h1>
  </div>
  
  <div style="padding: 40px 20px;">
    <h2 style="color: #1a1a1a; font-size: 24px; margin: 0 0 20px 0; font-weight: 600;">Votre code de connexion</h2>
    
    <p style="color: #4a5568; font-size: 16px; line-height: 1.5; margin: 0 0 30px 0;">
      Utilisez ce code pour vous connecter à votre compte Reachly :
    </p>
    
    <div style="background-color: #f7fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0;">
      <div style="font-size: 32px; font-weight: 700; letter-spacing: 0.1em; color: #1a1a1a; font-family: monospace;">
        {{ .Token }}
      </div>
    </div>
    
    <p style="color: #718096; font-size: 14px; line-height: 1.4; margin: 30px 0 0 0;">
      Ce code expire dans <strong>5 minutes</strong>.<br>
      Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.
    </p>
  </div>
  
  <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
    <p style="color: #6c757d; font-size: 12px; margin: 0;">
      © 2024 Reachly - Surveillance de formulaires intelligente
    </p>
  </div>
</div>
```

### Configuration des tokens OTP

Dans Settings > Authentication :

- **Enable email confirmations** : Activé
- **Token validity** : 300 (5 minutes)
- **Max frequency** : 60 (1 minute entre chaque envoi)

## 2. Variables d'environnement

Vérifiez que votre `.env.local` contient :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon
```

## 3. Test de l'authentification OTP

1. Allez sur http://localhost:3001/login
2. Cliquez sur "Connexion par code email"
3. Entrez votre adresse email
4. Vérifiez votre boîte mail pour le code à 6 chiffres
5. Saisissez le code dans l'interface

## 4. Fonctionnalités ajoutées

✅ **Mode OTP** : Saisie de l'email pour recevoir le code
✅ **Mode OTP Verify** : Saisie du code à 6 chiffres avec le composant OtpInput existant
✅ **Gestion d'erreurs** : Messages d'erreur localisés
✅ **UX fluide** : Animations et transitions cohérentes avec le design existant
✅ **Sécurité** : Utilisation de `shouldCreateUser: false` pour éviter la création de comptes non désirés

## 5. Interface utilisateur

L'authentification OTP s'intègre parfaitement dans le design existant :

- **Bouton d'accès** : "Connexion par code email" sur la page de connexion
- **Formulaire OTP** : Design cohérent avec les autres formulaires d'auth
- **Saisie du code** : Utilise le composant `OtpInput` existant avec animations
- **Navigation** : Liens de retour et de modification de l'email

## 6. Sécurité et limites

- Les codes expirent automatiquement après 5 minutes
- Protection contre le spam avec limite de fréquence
- Validation côté client et serveur
- Pas de création automatique de nouveaux comptes

L'authentification par OTP est maintenant entièrement fonctionnelle ! 🎉