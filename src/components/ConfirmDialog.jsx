import { useEffect } from 'react';

const ConfirmDialog = ({
  aberto,
  titulo = 'Confirmar ação',
  mensagem,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  variante = 'danger',
  onConfirmar,
  onCancelar,
}) => {
  useEffect(() => {
    if (!aberto) return;
    const onEsc = (e) => {
      if (e.key === 'Escape') onCancelar?.();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [aberto, onCancelar]);

  if (!aberto) return null;

  const corBotao =
    variante === 'danger'
      ? 'bg-red-500 hover:bg-red-600'
      : 'bg-youvisa-green hover:bg-youvisa-green-light';

  const corIcone =
    variante === 'danger'
      ? 'bg-red-100 text-red-500'
      : 'bg-youvisa-green/10 text-youvisa-green';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-fade-in"
      onClick={onCancelar}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start space-x-4 mb-4">
          <div className={`w-12 h-12 rounded-full ${corIcone} flex items-center justify-center flex-shrink-0`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-youvisa-gray">{titulo}</h3>
            <p className="text-gray-600 text-sm mt-1">{mensagem}</p>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onCancelar}
            className="px-4 py-2 text-sm font-semibold text-youvisa-gray border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {textoCancelar}
          </button>
          <button
            onClick={onConfirmar}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors shadow-sm ${corBotao}`}
          >
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
