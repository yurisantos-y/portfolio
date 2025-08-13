# Configuração de Autenticação - Debug

## Problema Identificado
O usuário estava sendo redirecionado para `http://localhost:3000/?code=...` após o login, ao invés de `https://yurisantos-y.vercel.app/dashboard`.

## Correções Implementadas

### 1. Removido redirectTo Global do Supabase Client
**Arquivo**: `src/utils/supabaseClient.js`
- Removido: `redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined`
- Motivo: Conflitava com o redirecionamento específico do OAuth

### 2. Melhorado Logs de Debug
**Arquivo**: `src/services/auth.js`
- Adicionados logs detalhados para debug do redirecionamento
- Logs incluem: hostname, porta, baseURL, redirectURL

**Arquivo**: `src/composables/useOAuthCallback.js`
- Adicionados logs para debug do callback
- Logs incluem: URL atual, hostname, origin, parâmetros de URL

### 3. URLs Corrigidas
- **Produção**: `https://yurisantos-y.vercel.app`
- **Desenvolvimento**: `http://localhost:5173` (porta do Vite)

## Configuração Necessária no Supabase

Para resolver completamente o problema, configure no Supabase Dashboard:

1. **Authentication → Settings**
2. **Site URL**: `https://yurisantos-y.vercel.app`
3. **Redirect URLs**: 
   - `https://yurisantos-y.vercel.app/dashboard`
   - `https://yurisantos-y.vercel.app/**` (wildcard para todas as rotas)
   - `http://localhost:5173/**` (para desenvolvimento)

## Como Testar

1. Deploy no Vercel
2. Acesse `https://yurisantos-y.vercel.app/login`
3. Clique em "Entrar com Google"
4. Após autenticação, deve redirecionar para `https://yurisantos-y.vercel.app/dashboard`

## Logs para Debug

Quando testar, verifique o console do navegador para os logs:
- `🔍 Login Debug Info` - informações do redirecionamento
- `🔄 Processing OAuth callback` - processamento do callback
- `✅ OAuth callback successful` - sucesso na autenticação
